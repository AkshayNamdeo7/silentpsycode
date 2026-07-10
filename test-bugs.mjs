import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  
  const allErrors = [];
  
  async function testPage(url, name) {
    const page = await context.newPage();
    const errs = [];
    page.on("console", (msg) => { if (msg.type() === "error") errs.push(msg.text()); });
    page.on("pageerror", (err) => errs.push(err.message));
    
    try {
      await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 10000 });
      await page.waitForTimeout(2000);
      const title = await page.title();
      console.log(`\u2713 ${name}: "${title}"`);
      if (errs.length > 0) {
        console.log(`  \u26A0 ${errs.length} console error(s):`);
        errs.slice(0, 3).forEach((e) => console.log(`    ${String(e).slice(0, 200)}`));
      }
    } catch (e) {
      console.log(`\u2717 ${name}: ${e.message?.slice(0, 200)}`);
    }
    await page.close();
  }
  
  await testPage("/", "Home page");
  await testPage("/login", "Login page");
  await testPage("/register", "Register page");
  await testPage("/forgot-password", "Forgot password page");
  await testPage("/books", "Browse books page");
  
  // Test auth + sell + browse flows
  const page = await context.newPage();
  page.on("console", (msg) => { if (msg.type() === "error") allErrors.push(msg.text()); });
  page.on("pageerror", (err) => allErrors.push(err.message));
  
  try {
    // ===== REGISTER =====
    console.log(`\n--- Register ---`);
    await page.goto(BASE + "/register", { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log(`Password field visible: ${await page.locator("#password").isVisible()}`);
    const showBtn = page.locator("button[aria-label='Show password']");
    console.log(`Show password btn: ${await showBtn.isVisible()}`);
    await showBtn.click();
    await page.waitForTimeout(200);
    console.log(`Hide password btn: ${await page.locator("button[aria-label='Hide password']").isVisible()}`);
    
    await page.fill("#name", "Test User");
    const email = `test${Date.now()}@example.com`;
    await page.fill("#email", email);
    await page.fill("#password", "TestPass123!");
    await page.fill("#confirmPassword", "TestPass123!");
    await page.click("button:has-text('Create account')");
    
    // Wait for dashboard URL
    try {
      await page.waitForURL("**/dashboard", { timeout: 10000 });
      console.log("Registered, redirected to dashboard");
    } catch {
      await page.screenshot({ path: "tmp/register-fail.png" });
      console.log("FAIL: Registration did not redirect to dashboard");
      console.log(`Current URL: ${page.url()}`);
    }
    
    // ===== DASHBOARD =====
    await page.waitForTimeout(500);
    console.log(`\n--- Dashboard ---`);
    console.log(`Title visible: ${await page.locator("text=Premium seller dashboard").isVisible()}`);
    console.log(`Total listings metric: ${await page.locator("text=Total listings").isVisible()}`);
    console.log(`Live books metric: ${await page.locator("text=Live books").isVisible()}`);
    
    // ===== SELL PAGE =====
    console.log(`\n--- Sell Page ---`);
    await page.goto(BASE + "/sell", { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Check file input
    const fileInput = page.locator("input[type='file']");
    console.log(`File input visible: ${await fileInput.isVisible()}`);
    
    // Upload image
    await fileInput.setInputFiles("public/test-book.png");
    await page.waitForTimeout(1000);
    
    const primaryPreview = page.locator("img[alt='Primary preview']");
    console.log(`Primary preview visible: ${await primaryPreview.isVisible()}`);
    
    // Check that a preview image was actually rendered
    const previewSrc = await primaryPreview.getAttribute("src");
    console.log(`Preview src starts with 'blob:': ${previewSrc?.startsWith("blob:")}`);
    
    // Fill form
    await page.fill("#title", "Test Book Title");
    await page.fill("#author", "Test Author");
    await page.fill("#isbn", "978-0073398217");
    await page.fill("#subject", "Test Subject");
    await page.fill("#sellingPrice", "500");
    await page.fill("#originalPrice", "1000");
    await page.fill("#college", "Test College");
    await page.fill("#branch", "CS");
    await page.fill("#semester", "5th");
    await page.fill("#city", "Test City");
    await page.fill("#sellerName", "Test Seller");
    await page.fill("#sellerPhone", "9876543210");
    await page.fill("#whatsappNumber", "9876543210");
    await page.fill("#email", email);
    await page.fill("#description", "Test description");
    
    await page.selectOption("select#category", "Engineering");
    await page.waitForTimeout(100);
    await page.selectOption("select#condition", "Good");
    
    // Contact preference - click label
    await page.locator("label:has-text('WhatsApp')").click();
    await page.waitForTimeout(200);
    
    // Verify contact preference is selected
    const wpRadio = page.locator("input[name='contactPreference'][value='WhatsApp']");
    console.log(`WhatsApp radio checked: ${await wpRadio.isChecked()}`);
    
    // Publish
    await page.click("button:has-text('Publish Book')");
    try {
      await page.waitForURL("**/dashboard", { timeout: 15000 });
      console.log("Published, redirected to dashboard");
    } catch {
      await page.screenshot({ path: "tmp/publish-fail.png" });
      console.log("FAIL: Publish did not redirect");
      console.log(`Current URL: ${page.url()}`);
    }
    
    // ===== DASHBOARD - VERIFY BOOK =====
    console.log(`\n--- Dashboard Verification ---`);
    await page.waitForTimeout(500);
    console.log(`'Test Book Title' visible: ${await page.locator("text=Test Book Title").first().isVisible()}`);
    
    // Check for Edit/Delete buttons
    const editLink = page.locator("a[href*='/sell?id=']").first();
    console.log(`Edit link visible: ${await editLink.isVisible()}`);
    const deleteBtn = page.locator("button:has-text('Delete')").first();
    console.log(`Delete button visible: ${await deleteBtn.isVisible()}`);
    
    // ===== BROWSE BOOKS =====
    console.log(`\n--- Browse Books ---`);
    await page.goto(BASE + "/books", { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const liveListings = page.locator("text=Live listings");
    console.log(`'Live listings' visible: ${await liveListings.isVisible()}`);
    
    const bookCards = page.locator("article");
    const cardCount = await bookCards.count();
    console.log(`Book cards count: ${cardCount}`);
    
    if (cardCount > 0) {
      // View first book details
      const firstCard = bookCards.first();
      console.log(`\nFirst book card:`);
      
      // Check elements on card
      const favBtn = firstCard.locator("button[aria-label='Add to wishlist']").or(firstCard.locator("button[aria-label='Remove from wishlist']"));
      console.log(`Favorite btn visible: ${await favBtn.isVisible()}`);
      const shareBtn = firstCard.locator("button[aria-label='Share listing']");
      console.log(`Share btn visible: ${await shareBtn.isVisible()}`);
      const viewDetails = firstCard.locator("a:has-text('View Details')");
      console.log(`View Details visible: ${await viewDetails.isVisible()}`);
      const conditionBadge = firstCard.locator("span:has-text('Good'), span:has-text('New'), span:has-text('Like New'), span:has-text('Fair')").first();
      console.log(`Condition badge visible: ${await conditionBadge.isVisible()}`);
      const cardTitle = firstCard.locator("h3");
      console.log(`Book title 'h3' visible: ${await cardTitle.isVisible()}`);
      
      // Navigate to book detail
      const bookLink = page.locator("a[aria-label*='View details']").first();
      await bookLink.click();
      await page.waitForURL("**/books/**", { timeout: 10000 });
      await page.waitForTimeout(1000);
      console.log(`\n--- Book Detail Page ---`);
      console.log(`Page title: ${await page.title()}`);
      
      // Check book detail elements
      const detailTitle = page.locator("text=Book details");
      console.log(`'Book details' label: ${await detailTitle.isVisible()}`);
      
      const backBtn = page.locator("button:has-text('Back to browse')");
      console.log(`Back to browse btn: ${await backBtn.isVisible()}`);
      
      const shareBtn2 = page.locator("button[aria-label='Share listing']");
      console.log(`Share btn: ${await shareBtn2.isVisible()}`);
      
      const favBtn2 = page.locator("button[aria-label='Add to wishlist']");
      console.log(`Add to wishlist btn: ${await favBtn2.isVisible()}`);
      
      // Toggle favorite
      if (await favBtn2.isVisible()) {
        await favBtn2.click();
        await page.waitForTimeout(300);
        console.log(`Remove from wishlist visible: ${await page.locator("button[aria-label='Remove from wishlist']").isVisible()}`);
      }
      
      // Test share
      await context.grantPermissions(["clipboard-write"]);
      await shareBtn2.click();
      await page.waitForTimeout(500);
      const checkIcon = shareBtn2.locator("svg.lucide-check");
      console.log(`Check icon after share: ${await checkIcon.isVisible()}`);
      
      // Contact seller button
      const contactBtn = page.locator("a:has-text('Call seller'), a:has-text('Email seller'), a:has-text('Contact seller')").first();
      console.log(`Contact seller btn visible: ${await contactBtn.isVisible()}`);
      
      // Back button
      await backBtn.click();
      await page.waitForURL("**/books", { timeout: 10000 });
      console.log("Back to browse works");
    }
    
    // ===== SEARCH =====
    console.log(`\n--- Search ---`);
    await page.goto(BASE + "/books", { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(1000);
    
    const searchInput = page.locator("input[aria-label='Search books']");
    console.log(`Search input visible: ${await searchInput.isVisible()}`);
    
    await searchInput.fill("Test");
    await page.waitForTimeout(1500);
    let resultCount = await page.locator("article").count();
    console.log(`Search 'Test' results: ${resultCount}`);
    
    await searchInput.fill("");
    await page.waitForTimeout(500);
    await searchInput.fill("xyznonexistentbook12345");
    await page.waitForTimeout(1500);
    console.log(`'No books found' visible: ${await page.locator("text=No books found").isVisible()}`);
    
    // ===== FILTERS =====
    console.log(`\n--- Filters ---`);
    await page.goto(BASE + "/books", { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(1000);
    
    const catSelect = page.locator("select[aria-label='Filter by category']");
    console.log(`Category filter visible: ${await catSelect.isVisible()}`);
    const condSelect = page.locator("select[aria-label='Filter by condition']");
    console.log(`Condition filter visible: ${await condSelect.isVisible()}`);
    const sortSelect = page.locator("select[aria-label='Sort books']");
    console.log(`Sort filter visible: ${await sortSelect.isVisible()}`);
    const minPrice = page.locator("input[aria-label='Minimum price']");
    console.log(`Min price visible: ${await minPrice.isVisible()}`);
    const maxPrice = page.locator("input[aria-label='Maximum price']");
    console.log(`Max price visible: ${await maxPrice.isVisible()}`);
    const collegeFilter = page.locator("input[aria-label='Filter by college']");
    console.log(`College filter visible: ${await collegeFilter.isVisible()}`);
    const cityFilter = page.locator("input[aria-label='Filter by city']");
    console.log(`City filter visible: ${await cityFilter.isVisible()}`);
    const clearBtn = page.locator("button:has-text('Clear filters')");
    console.log(`Clear filters button: ${await clearBtn.isVisible()}`);
    
    // Test category filter
    await catSelect.selectOption("Engineering");
    await page.waitForTimeout(1000);
    console.log(`After Engineering filter, cards: ${await page.locator("article").count()}`);
    
    // Test sort
    await sortSelect.selectOption("lowest");
    await page.waitForTimeout(500);
    console.log(`After sort 'lowest', cards: ${await page.locator("article").count()}`);
    
    await sortSelect.selectOption("highest");
    await page.waitForTimeout(500);
    
    // Test price range
    await minPrice.fill("100");
    await maxPrice.fill("1000");
    await page.waitForTimeout(500);
    
    // Clear filters
    await clearBtn.click();
    await page.waitForTimeout(500);
    console.log(`After clear, search value empty: ${await searchInput.inputValue() === ""}`);
    
    // ===== FAVORITES PAGE =====
    console.log(`\n--- Favorites Page ---`);
    await page.goto(BASE + "/dashboard/favorites", { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(1000);
    console.log(`Title: ${await page.title()}`);
    console.log(`'My Wishlist' visible: ${await page.locator("text=My Wishlist").isVisible()}`);
    
    // ===== LOGOUT =====
    console.log(`\n--- Logout ---`);
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Test User initials should be "TU"
    const avatar = page.locator("button:has-text('TU')");
    let avatarVisible = false;
    try {
      avatarVisible = await avatar.isVisible({ timeout: 3000 });
    } catch {}
    console.log(`Avatar 'TU' visible: ${avatarVisible}`);
    
    if (avatarVisible) {
      await avatar.click();
      await page.waitForTimeout(300);
      const signOutBtn = page.locator("button:has-text('Sign out')");
      console.log(`Sign out btn visible: ${await signOutBtn.isVisible()}`);
      await signOutBtn.click();
      await page.waitForURL("**/", { timeout: 10000 });
      console.log("Logged out successfully");
      
      // Check middleware redirect for /sell
      await page.goto(BASE + "/sell", { waitUntil: "domcontentloaded", timeout: 10000 });
      await page.waitForTimeout(2000);
      console.log(`After logout, /sell -> login: ${page.url().includes('/login')}`);
    } else {
      console.log("SKIP: Avatar not found, can't test logout");
    }
    
  } catch (e) {
    console.log(`\nERROR: ${e.message?.slice(0, 500)}`);
    await page.screenshot({ path: "tmp/error.png" }).catch(() => {});
  }
  
  if (allErrors.length > 0) {
    console.log(`\n=== Console Errors (${allErrors.length}) ===`);
    const unique = [...new Set(allErrors.map(e => String(e).split('\n')[0]))];
    unique.slice(0, 5).forEach((e, i) => console.log(`${i + 1}. ${e.slice(0, 300)}`));
  }
  
  await browser.close();
  console.log("\nTesting complete");
}

main();
