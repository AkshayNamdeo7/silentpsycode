import { test, expect } from "@playwright/test";
import path from "path";

const USER = {
  name: "Test User",
  email: "test@example.com",
  password: "TestPass123!",
};

const BOOK = {
  title: "Introduction to Thermodynamics",
  author: "Cengel & Boles",
  sellerName: USER.name,
  category: "Engineering",
  subject: "Thermodynamics",
  condition: "Good",
  sellingPrice: "450",
  originalPrice: "1200",
  description: "A great textbook for engineering students.",
  college: "MIT College of Engineering",
  branch: "Mechanical Engineering",
  semester: "5th Semester",
  city: "New Delhi",
  sellerPhone: "9876543210",
  whatsappNumber: "9876543210",
  email: USER.email,
  contactPreference: "WhatsApp",
};

async function registerUser(page: typeof test.prototype.page, name: string, email: string, password: string) {
  await page.goto("/register");
  await expect(page.locator("h1")).toContainText("Join Silent Psycode");
  await page.fill("#name", name);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.fill("#confirmPassword", password);
  await page.click("button:has-text('Create account')");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await expect(page.locator("text=Premium seller dashboard")).toBeVisible({ timeout: 5000 });
}

async function loginUser(page: typeof test.prototype.page, email: string, password: string) {
  await page.goto("/login");
  await expect(page.locator("h1")).toContainText("Welcome back");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button:has-text('Continue')");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await expect(page.locator("text=Premium seller dashboard")).toBeVisible({ timeout: 5000 });
}

async function publishBook(page: typeof test.prototype.page, overrides: Record<string, string> = {}) {
  const data = { ...BOOK, ...overrides };
  await page.goto("/sell");
  await expect(page.locator("text=List your second-hand book")).toBeVisible();

  const fileInput = page.locator("input[type='file']");
  const testImagePath = path.resolve("public/test-book.png");
  await fileInput.setInputFiles(testImagePath);
  await page.waitForTimeout(500);

  await page.fill("#title", data.title);
  await page.fill("#author", data.author);
  await page.fill("#isbn", "978-0073398217");
  await page.fill("#subject", data.subject);
  await page.fill("#sellingPrice", data.sellingPrice);
  await page.fill("#originalPrice", data.originalPrice);
  await page.fill("#college", data.college);
  await page.fill("#branch", data.branch);
  await page.fill("#semester", data.semester);
  await page.fill("#city", data.city);
  await page.fill("#sellerName", data.sellerName);
  await page.fill("#sellerPhone", data.sellerPhone);
  await page.fill("#whatsappNumber", data.whatsappNumber);
  await page.fill("#email", data.email);

  const description = page.locator("#description");
  await description.fill(data.description);

  await page.selectOption("select#category", data.category);
  await page.selectOption("select#condition", data.condition);

  await page.locator(`label:has-text('${data.contactPreference}')`).click();

  await page.click("button:has-text('Publish Book')");
  await page.waitForURL("/dashboard", { timeout: 15000 });
}

test.describe("Authentication", () => {
  test("Register a new user", async ({ page }) => {
    await registerUser(page, USER.name, USER.email, USER.password);
  });

  test("Login with registered user", async ({ page }) => {
    await page.context().addInitScript(() => {
      const users: Record<string, { id: string; email: string; password: string; full_name: string; created_at: string }> = {};
      users["test@example.com"] = {
        id: crypto.randomUUID(),
        email: "test@example.com",
        password: "TestPass123!",
        full_name: "Test User",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("silentpsy-demo-users", JSON.stringify(users));
    });
    await loginUser(page, USER.email, USER.password);
  });

  test("Login with redirect param", async ({ page }) => {
    await page.context().addInitScript(() => {
      const users: Record<string, { id: string; email: string; password: string; full_name: string; created_at: string }> = {};
      users["test@example.com"] = {
        id: crypto.randomUUID(),
        email: "test@example.com",
        password: "TestPass123!",
        full_name: "Test User",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("silentpsy-demo-users", JSON.stringify(users));
    });
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await page.fill("#email", USER.email);
    await page.fill("#password", USER.password);
    await page.click("button:has-text('Continue')");
    await page.waitForURL("/dashboard", { timeout: 10000 });
    await expect(page.locator("text=Premium seller dashboard")).toBeVisible({ timeout: 5000 });
  });

  test("Forgot password flow", async ({ page }) => {
    await page.context().addInitScript(() => {
      const users: Record<string, { id: string; email: string; password: string; full_name: string; created_at: string }> = {};
      users["test@example.com"] = {
        id: crypto.randomUUID(),
        email: "test@example.com",
        password: "TestPass123!",
        full_name: "Test User",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("silentpsy-demo-users", JSON.stringify(users));
    });
    await page.goto("/forgot-password");
    await expect(page.locator("h1")).toContainText("Recover your account");
    await page.fill("#email", USER.email);
    await page.click("button:has-text('Send reset link')");
    await expect(page.locator("text=Password reset link prepared")).toBeVisible({ timeout: 5000 });
  });

  test("Google OAuth button is present", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Sign in with Google")).toBeVisible();
  });

  test("Logout flow", async ({ page }) => {
    await registerUser(page, "Logout User", "logout@example.com", USER.password);
    await page.goto("/");
    const avatar = page.locator("button:has-text('LO')");
    await expect(avatar).toBeVisible({ timeout: 5000 });
    await avatar.click();
    await page.locator("button:has-text('Sign out')").click();
    await page.waitForURL("/", { timeout: 10000 });
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 10000 });
  });
});

test.describe("Sell Book Flow", () => {
  test("Sell book form - fill and publish", async ({ page }) => {
    await registerUser(page, USER.name, `sell-${Date.now()}@example.com`, USER.password);
    await publishBook(page);
    await expect(page.locator(`text=${BOOK.title}`).first()).toBeVisible({ timeout: 5000 });
  });

  test("Image upload and preview on sell page", async ({ page }) => {
    await registerUser(page, USER.name, `img-${Date.now()}@example.com`, USER.password);
    await page.goto("/sell");
    await expect(page.locator("text=List your second-hand book")).toBeVisible();
    const fileInput = page.locator("input[type='file']");
    const testImagePath = path.resolve("public/test-book.png");
    await fileInput.setInputFiles(testImagePath);
    await page.waitForTimeout(1000);
    const previewImage = page.locator("img[alt='Primary preview']");
    await expect(previewImage).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Listing preview")).toBeVisible();
  });

  test("Edit a listing", async ({ page }) => {
    const email = `edit-${Date.now()}@example.com`;
    await registerUser(page, USER.name, email, USER.password);
    await publishBook(page);
    await page.waitForTimeout(500);
    const editLink = page.locator(`a[href*='/sell?id=']`).first();
    await expect(editLink).toBeVisible({ timeout: 5000 });
    await editLink.scrollIntoViewIfNeeded();
    await editLink.click();
    await page.waitForURL(/\/sell\?id=/, { timeout: 10000 });
    await page.waitForTimeout(500);
    const updatedTitle = `${BOOK.title} (Updated)`;
    await page.fill("#title", "");
    await page.fill("#title", updatedTitle);
    await page.click("button:has-text('Publish Book')");
    await page.waitForURL("/dashboard", { timeout: 15000 });
    await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible({ timeout: 5000 });
  });

  test("Delete a listing", async ({ page }) => {
    const email = `del-${Date.now()}@example.com`;
    await registerUser(page, USER.name, email, USER.password);
    await publishBook(page);
    await page.waitForTimeout(500);
    page.on("dialog", (dialog) => dialog.accept());
    const deleteBtn = page.locator("button:has-text('Delete')").first();
    await expect(deleteBtn).toBeVisible({ timeout: 5000 });
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=${BOOK.title}`)).not.toBeVisible();
  });
});

test.describe("Browse Books", () => {
  test("Books page loads and shows listings", async ({ page }) => {
    await page.goto("/books");
    await expect(page.locator("text=Book marketplace")).toBeVisible();
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Live listings")).toBeVisible();
  });

  test("Search books", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const searchInput = page.locator("input[aria-label='Search books']");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Engineering");
    await page.waitForTimeout(1500);
    const bookCards = page.locator("article");
    const count = await bookCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Filter by category", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const categorySelect = page.locator("select[aria-label='Filter by category']");
    await categorySelect.selectOption("Engineering");
    await page.waitForTimeout(1000);
  });

  test("Filter by condition", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const conditionSelect = page.locator("select[aria-label='Filter by condition']");
    await conditionSelect.selectOption("Good");
    await page.waitForTimeout(1000);
  });

  test("Sort books", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const sortSelect = page.locator("select[aria-label='Sort books']");
    await sortSelect.selectOption("lowest");
    await page.waitForTimeout(500);
    await sortSelect.selectOption("highest");
    await page.waitForTimeout(500);
  });

  test("Filter by price range", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const minPrice = page.locator("input[aria-label='Minimum price']");
    const maxPrice = page.locator("input[aria-label='Maximum price']");
    await minPrice.fill("100");
    await maxPrice.fill("1000");
    await page.waitForTimeout(1000);
  });

  test("Clear filters", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const searchInput = page.locator("input[aria-label='Search books']");
    await searchInput.fill("Test Book");
    await page.waitForTimeout(500);
    await page.locator("button:has-text('Clear filters')").click();
    await page.waitForTimeout(500);
    await expect(searchInput).toHaveValue("");
  });

  test("Sell a book button navigates to sell page", async ({ page }) => {
    await registerUser(page, USER.name, `nav-${Date.now()}@example.com`, USER.password);
    await page.goto("/books");
    await page.waitForTimeout(1000);
    await page.locator("a:has-text('Sell a book')").first().click();
    await page.waitForURL("/sell", { timeout: 10000 });
    await expect(page.locator("text=List your second-hand book")).toBeVisible();
  });
});

test.describe("Book Details", () => {
  test("View book details from page", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const bookLink = page.locator("a[aria-label*='View details']").first();
    await expect(bookLink).toBeVisible({ timeout: 5000 });
    await bookLink.click();
    await page.waitForURL(/\/books\//, { timeout: 10000 });
    await expect(page.locator("text=Book details")).toBeVisible();
  });

  test("Back to browse button works", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const bookLink = page.locator("a[aria-label*='View details']").first();
    await expect(bookLink).toBeVisible({ timeout: 5000 });
    await bookLink.click();
    await page.waitForURL(/\/books\//, { timeout: 10000 });
    await page.locator("button:has-text('Back to browse')").click();
    await page.waitForURL("/books", { timeout: 10000 });
  });

  test("Book detail error state - invalid ID", async ({ page }) => {
    await page.goto("/books/invalid-id-12345");
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Book unavailable")).toBeVisible({ timeout: 10000 });
    await page.locator("button:has-text('Back to browse')").click();
    await page.waitForURL("/books", { timeout: 10000 });
  });

  test("Share button exists on book detail", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const bookLink = page.locator("a[aria-label*='View details']").first();
    await expect(bookLink).toBeVisible({ timeout: 5000 });
    await bookLink.click();
    await page.waitForURL(/\/books\//, { timeout: 10000 });
    const shareButton = page.locator("button[aria-label='Share listing']");
    await expect(shareButton).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Favorites", () => {
  test("Favorite a book from book detail page", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const bookLink = page.locator("a[aria-label*='View details']").first();
    await expect(bookLink).toBeVisible({ timeout: 5000 });
    await bookLink.click();
    await page.waitForURL(/\/books\//, { timeout: 10000 });
    const favBtn = page.locator("button[aria-label='Add to wishlist']");
    await expect(favBtn).toBeVisible({ timeout: 5000 });
    await favBtn.click();
    await page.waitForTimeout(500);
    await expect(page.locator("button[aria-label='Remove from wishlist']")).toBeVisible();
  });

  test("Favorite a book from book card", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const favBtn = page.locator("button[aria-label='Add to wishlist']").first();
    await expect(favBtn).toBeVisible({ timeout: 5000 });
    await favBtn.click();
    await page.waitForTimeout(500);
    await expect(page.locator("button[aria-label='Remove from wishlist']").first()).toBeVisible();
  });

  test("Favorites page shows favorited books", async ({ page }) => {
    await registerUser(page, USER.name, `fav-${Date.now()}@example.com`, USER.password);
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const favBtn = page.locator("button[aria-label='Add to wishlist']").first();
    await expect(favBtn).toBeVisible({ timeout: 5000 });
    await favBtn.click();
    await page.waitForTimeout(500);

    await page.goto("/dashboard/favorites");
    await page.waitForTimeout(2000);
    await expect(page.locator("text=My Wishlist")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Share", () => {
  test("Share button works on book card via clipboard", async ({ page }) => {
    await page.context().grantPermissions(["clipboard-write"]);
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const shareBtn = page.locator("button[aria-label='Share listing']").first();
    await expect(shareBtn).toBeVisible({ timeout: 5000 });
    await shareBtn.click();
    await page.waitForTimeout(500);
    await expect(shareBtn.locator("svg.lucide-check")).toBeVisible();
  });

  test("Share button works on book detail", async ({ page }) => {
    await page.context().grantPermissions(["clipboard-write"]);
    await page.goto("/books");
    await page.waitForTimeout(2000);
    const bookLink = page.locator("a[aria-label*='View details']").first();
    await expect(bookLink).toBeVisible({ timeout: 5000 });
    await bookLink.click();
    await page.waitForURL(/\/books\//, { timeout: 10000 });
    const shareBtn = page.locator("button[aria-label='Share listing']").first();
    await expect(shareBtn).toBeVisible({ timeout: 5000 });
    await shareBtn.click();
    await page.waitForTimeout(500);
    await expect(shareBtn.locator("svg.lucide-check")).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  test("Dashboard loads and shows metrics", async ({ page }) => {
    await registerUser(page, USER.name, `dash-${Date.now()}@example.com`, USER.password);
    await expect(page.locator("text=Premium seller dashboard")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Total listings")).toBeVisible();
    await expect(page.locator("text=Live books")).toBeVisible();
    await expect(page.locator("text=Drafts")).toBeVisible();
  });

  test("Dashboard shows published books", async ({ page }) => {
    const email = `dash2-${Date.now()}@example.com`;
    await registerUser(page, USER.name, email, USER.password);
    await publishBook(page);
    await expect(page.locator(`text=${BOOK.title}`).first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Search", () => {
  test("Search from books page filters results", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const searchInput = page.locator("input[aria-label='Search books']");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Physics");
    await page.waitForTimeout(1500);
    const bookCards = page.locator("article");
    const count = await bookCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Search with no results shows empty state", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const searchInput = page.locator("input[aria-label='Search books']");
    await searchInput.fill("xyznonexistentbook");
    await page.waitForTimeout(1500);
    await expect(page.locator("text=No books found")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Filters", () => {
  test("Filter by college", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const collegeInput = page.locator("input[aria-label='Filter by college']");
    await collegeInput.fill("IIT");
    await page.waitForTimeout(1000);
  });

  test("Filter by city", async ({ page }) => {
    await page.goto("/books");
    await page.waitForTimeout(1000);
    const cityInput = page.locator("input[aria-label='Filter by city']");
    await cityInput.fill("Delhi");
    await page.waitForTimeout(1000);
  });
});
