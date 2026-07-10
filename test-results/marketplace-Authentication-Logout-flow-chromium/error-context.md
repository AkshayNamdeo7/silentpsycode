# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: marketplace.spec.ts >> Authentication >> Logout flow
- Location: e2e\marketplace.spec.ts:154:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text(\'Sign out\')')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e4]:
      - link "Silent Psycode Premium book marketplace" [ref=e5] [cursor=pointer]:
        - /url: /
        - paragraph [ref=e6]: Silent Psycode
        - paragraph [ref=e7]: Premium book marketplace
      - generic [ref=e8]:
        - link "Books" [ref=e9] [cursor=pointer]:
          - /url: /#books
        - link "FAQ" [ref=e10] [cursor=pointer]:
          - /url: /#faq
        - generic [ref=e11]:
          - button "LU logout" [active] [ref=e12]:
            - generic [ref=e13]: LU
            - generic [ref=e14]: logout
            - img [ref=e15]
          - generic [ref=e18]:
            - link "Dashboard" [ref=e19] [cursor=pointer]:
              - /url: /dashboard
              - img [ref=e20]
              - text: Dashboard
            - link "My Books" [ref=e25] [cursor=pointer]:
              - /url: /dashboard
              - img [ref=e26]
              - text: My Books
            - link "Sell Book" [ref=e28] [cursor=pointer]:
              - /url: /sell
              - img [ref=e29]
              - text: Sell Book
            - link "Settings" [ref=e31] [cursor=pointer]:
              - /url: /dashboard
              - img [ref=e32]
              - text: Settings
            - button "Logout" [ref=e35]:
              - img [ref=e36]
              - text: Logout
    - generic [ref=e43]:
      - generic [ref=e44]:
        - paragraph [ref=e45]: Trusted student marketplace
        - heading "Buy & Sell Second-Hand Books at Student-Friendly Prices" [level=1] [ref=e46]
        - paragraph [ref=e47]: Save up to 70% by buying used books or earn money by selling books you no longer need.
      - generic [ref=e49]:
        - generic [ref=e50]: Search by book name, author, subject or ISBN
        - searchbox "Search by book name, author, subject or ISBN" [ref=e51]
      - generic [ref=e52]:
        - link "Buy Books" [ref=e53] [cursor=pointer]:
          - /url: /books
        - link "Sell Your Books" [ref=e54] [cursor=pointer]:
          - /url: /sell
      - generic [ref=e56]:
        - generic [ref=e57]: Engineering
        - generic [ref=e58]: Medical
        - generic [ref=e59]: UPSC
        - generic [ref=e60]: JEE
        - generic [ref=e61]: NEET
        - generic [ref=e62]: School
        - generic [ref=e63]: Novels
      - generic [ref=e64]:
        - generic [ref=e66]:
          - generic [ref=e67]: ✓
          - generic [ref=e68]:
            - paragraph [ref=e69]: Verified Sellers
            - paragraph [ref=e70]: All sellers are vetted to keep every book trusted.
        - generic [ref=e72]:
          - generic [ref=e73]: ✓
          - generic [ref=e74]:
            - paragraph [ref=e75]: Affordable Prices
            - paragraph [ref=e76]: Student-friendly savings on every used textbook.
        - generic [ref=e78]:
          - generic [ref=e79]: ✓
          - generic [ref=e80]:
            - paragraph [ref=e81]: Fast Listing
            - paragraph [ref=e82]: Sell books quickly with a smooth, modern workflow.
        - generic [ref=e84]:
          - generic [ref=e85]: ✓
          - generic [ref=e86]:
            - paragraph [ref=e87]: Secure Marketplace
            - paragraph [ref=e88]: Your transactions and listings are protected end-to-end.
    - generic [ref=e90]:
      - generic [ref=e91]:
        - generic [ref=e92]: Premium books
        - paragraph [ref=e93]: 10K+
      - generic [ref=e94]:
        - generic [ref=e95]: Average reader score
        - paragraph [ref=e96]: 4.9/5
      - generic [ref=e97]:
        - generic [ref=e98]: Fast processing
        - paragraph [ref=e99]: 24h
    - generic [ref=e100]:
      - generic [ref=e101]:
        - paragraph [ref=e102]: Featured Categories
        - heading "Discover curated reading paths for every mood." [level=2] [ref=e103]
        - paragraph [ref=e104]: Explore premium categories crafted for ambitious learners, casual readers, and story lovers alike.
      - generic [ref=e105]:
        - article [ref=e106]:
          - generic [ref=e107]: ✨
          - paragraph [ref=e108]: 3.5K titles
          - heading "Fiction" [level=3] [ref=e109]
          - paragraph [ref=e110]: Premium handpicked books and bestselling collections for focused reading.
        - article [ref=e111]:
          - generic [ref=e112]: 💼
          - paragraph [ref=e113]: 1.2K titles
          - heading "Business" [level=3] [ref=e114]
          - paragraph [ref=e115]: Premium handpicked books and bestselling collections for focused reading.
        - article [ref=e116]:
          - generic [ref=e117]: 🌱
          - paragraph [ref=e118]: 940 titles
          - heading "Self Improvement" [level=3] [ref=e119]
          - paragraph [ref=e120]: Premium handpicked books and bestselling collections for focused reading.
        - article [ref=e121]:
          - generic [ref=e122]: 🕵️
          - paragraph [ref=e123]: 760 titles
          - heading "Mystery" [level=3] [ref=e124]
          - paragraph [ref=e125]: Premium handpicked books and bestselling collections for focused reading.
    - generic [ref=e126]:
      - generic [ref=e127]:
        - generic [ref=e128]:
          - paragraph [ref=e129]: Featured books
          - heading "Discover handpicked reads with premium value." [level=2] [ref=e130]
        - paragraph [ref=e131]: Browse our top curated books across genres, selected for curious readers and ambitious minds.
      - generic [ref=e132]:
        - article [ref=e133]:
          - generic [ref=e134]:
            - generic [ref=e135]: Best Seller
            - generic [ref=e136]: ₹499
          - generic [ref=e137]: 📚
          - heading "Atomic Habits" [level=3] [ref=e138]
          - paragraph [ref=e139]: James Clear
          - paragraph [ref=e140]: Small changes, remarkable results — a modern business and habit classic.
          - link "View details" [ref=e141] [cursor=pointer]:
            - /url: /books
        - article [ref=e142]:
          - generic [ref=e143]:
            - generic [ref=e144]: Staff Pick
            - generic [ref=e145]: ₹399
          - generic [ref=e146]: 📚
          - heading "The Alchemist" [level=3] [ref=e147]
          - paragraph [ref=e148]: Paulo Coelho
          - paragraph [ref=e149]: A timeless story of discovery and the power of following your dreams.
          - link "View details" [ref=e150] [cursor=pointer]:
            - /url: /books
        - article [ref=e151]:
          - generic [ref=e152]:
            - generic [ref=e153]: Top Finance
            - generic [ref=e154]: ₹599
          - generic [ref=e155]: 📚
          - heading "Rich Dad Poor Dad" [level=3] [ref=e156]
          - paragraph [ref=e157]: Robert Kiyosaki
          - paragraph [ref=e158]: A bold guide to financial literacy and life-changing money mindset.
          - link "View details" [ref=e159] [cursor=pointer]:
            - /url: /books
    - generic [ref=e160]:
      - generic [ref=e161]:
        - paragraph [ref=e162]: Best Sellers
        - heading "Readers are raving about these premium titles." [level=2] [ref=e163]
        - paragraph [ref=e164]: High-impact best sellers across business, wellness, and fiction, curated for your next great read.
      - generic [ref=e165]:
        - article [ref=e166]:
          - generic [ref=e167]:
            - generic [ref=e168]:
              - paragraph [ref=e169]: Top Choice
              - heading "The Midnight Library" [level=3] [ref=e170]
            - generic [ref=e171]: 📘
          - paragraph [ref=e172]: Matt Haig delivers an immersive and transformative reading experience for the modern reader.
          - generic [ref=e173]:
            - generic [ref=e174]: ₹350
            - link "Buy Now" [ref=e175] [cursor=pointer]:
              - /url: /books
        - article [ref=e176]:
          - generic [ref=e177]:
            - generic [ref=e178]:
              - paragraph [ref=e179]: Editor’s Pick
              - heading "Digital Minimalism" [level=3] [ref=e180]
            - generic [ref=e181]: 📘
          - paragraph [ref=e182]: Cal Newport delivers an immersive and transformative reading experience for the modern reader.
          - generic [ref=e183]:
            - generic [ref=e184]: ₹420
            - link "Buy Now" [ref=e185] [cursor=pointer]:
              - /url: /books
        - article [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]:
              - paragraph [ref=e189]: Must Read
              - heading "Think Again" [level=3] [ref=e190]
            - generic [ref=e191]: 📘
          - paragraph [ref=e192]: Adam Grant delivers an immersive and transformative reading experience for the modern reader.
          - generic [ref=e193]:
            - generic [ref=e194]: ₹490
            - link "Buy Now" [ref=e195] [cursor=pointer]:
              - /url: /books
    - generic [ref=e196]:
      - generic [ref=e197]:
        - paragraph [ref=e198]: Why Choose Us
        - heading "A premium experience for modern readers." [level=2] [ref=e199]
        - paragraph [ref=e200]: Book discovery, buying and community all wrapped in a dark, luxurious marketplace experience.
      - generic [ref=e201]:
        - generic [ref=e202]:
          - generic [ref=e203]: ✓
          - heading "Buy, sell and discover" [level=3] [ref=e204]
          - paragraph [ref=e205]: A premium book marketplace built for book lovers who want modern browsing, fair pricing, and seamless checkout.
        - generic [ref=e206]:
          - generic [ref=e207]: ✓
          - heading "Curated collections" [level=3] [ref=e208]
          - paragraph [ref=e209]: Explore collections chosen by experts, authors, and trendsetters for faster discovery and higher-quality reads.
        - generic [ref=e210]:
          - generic [ref=e211]: ✓
          - heading "Personalized recommendations" [level=3] [ref=e212]
          - paragraph [ref=e213]: Find books matched to your interests with smart browsing and curated featured lists.
    - generic [ref=e214]:
      - generic [ref=e215]:
        - paragraph [ref=e216]: Testimonials
        - heading "Readers trust the marketplace for premium recommendations." [level=2] [ref=e217]
        - paragraph [ref=e218]: High ratings from avid readers and creators who love the modern, high-end experience.
      - generic [ref=e219]:
        - article [ref=e220]:
          - paragraph [ref=e221]: “The most polished book marketplace I've used in years — fast, elegant and inspiring.”
          - generic [ref=e222]:
            - paragraph [ref=e223]: Ananya Gupta
            - paragraph [ref=e224]: Entrepreneur
        - article [ref=e225]:
          - paragraph [ref=e226]: “A beautifully dark interface with very smart book discovery and flawless checkout.”
          - generic [ref=e227]:
            - paragraph [ref=e228]: Rahul Mehta
            - paragraph [ref=e229]: Product Designer
        - article [ref=e230]:
          - paragraph [ref=e231]: “I found more premium reads in a single session than on any other platform.”
          - generic [ref=e232]:
            - paragraph [ref=e233]: Simran Kaur
            - paragraph [ref=e234]: Literary Curator
    - generic [ref=e235]:
      - generic [ref=e236]:
        - paragraph [ref=e237]: FAQ
        - heading "Questions answered for premium book lovers." [level=2] [ref=e238]
        - paragraph [ref=e239]: Everything you need to know about browsing, buying, selling and discovering exceptional reads.
      - generic [ref=e240]:
        - generic [ref=e241]:
          - heading "How fast can I receive my books?" [level=3] [ref=e242]
          - paragraph [ref=e243]: Most orders ship within 24 hours, and digital titles are delivered instantly after checkout.
        - generic [ref=e244]:
          - heading "Can I sell my used books here?" [level=3] [ref=e245]
          - paragraph [ref=e246]: Yes. Our marketplace supports easy listings for used and collectible books with transparent pricing.
        - generic [ref=e247]:
          - heading "Do you offer recommendations?" [level=3] [ref=e248]
          - paragraph [ref=e249]: Absolutely — our curated collections and trending recommendations help you find the right book quickly.
    - generic [ref=e252]:
      - generic [ref=e253]:
        - paragraph [ref=e254]: Stay in the loop
        - heading "Get premium book drops and marketplace updates." [level=2] [ref=e255]
        - paragraph [ref=e256]: Join our newsletter for curated deals, author drops, and first access to exclusive releases.
      - generic [ref=e257]:
        - text: Email address
        - textbox "Email address" [ref=e258]:
          - /placeholder: you@example.com
        - button "Subscribe now" [ref=e259]
    - generic [ref=e260]:
      - generic [ref=e261]:
        - generic [ref=e262]:
          - paragraph [ref=e263]: Silent Psycode
          - paragraph [ref=e264]: A premium book marketplace for readers who want beautifully curated discovery, fast buying and thoughtful recommendations.
          - generic [ref=e265]:
            - paragraph [ref=e266]: Need support?
            - paragraph [ref=e267]:
              - text: Reach out at
              - link "hello@silentpsycode.com" [ref=e268] [cursor=pointer]:
                - /url: mailto:hello@silentpsycode.com
        - generic [ref=e269]:
          - generic [ref=e270]:
            - paragraph [ref=e271]: Marketplace
            - navigation [ref=e272]:
              - link "Categories" [ref=e273] [cursor=pointer]:
                - /url: /#categories
              - link "Featured Books" [ref=e274] [cursor=pointer]:
                - /url: /#books
              - link "FAQ" [ref=e275] [cursor=pointer]:
                - /url: /#faq
          - generic [ref=e276]:
            - paragraph [ref=e277]: Company
            - navigation [ref=e278]:
              - link "About" [ref=e279] [cursor=pointer]:
                - /url: "#"
              - link "Careers" [ref=e280] [cursor=pointer]:
                - /url: "#"
              - link "Contact" [ref=e281] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e282]:
          - paragraph [ref=e283]: Stay connected
          - paragraph [ref=e284]: Subscribe for updates on premium drops, author moments, and marketplace exclusives.
          - generic [ref=e285]:
            - link "Newsletter" [ref=e286] [cursor=pointer]:
              - /url: "#"
            - link "Start selling" [ref=e287] [cursor=pointer]:
              - /url: "#"
      - generic [ref=e288]: © 2026 Silent Psycode. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e294] [cursor=pointer]:
    - img [ref=e295]
  - alert [ref=e298]
```

# Test source

```ts
  60  |   await page.waitForTimeout(500);
  61  | 
  62  |   await page.fill("#title", data.title);
  63  |   await page.fill("#author", data.author);
  64  |   await page.fill("#isbn", "978-0073398217");
  65  |   await page.fill("#subject", data.subject);
  66  |   await page.fill("#sellingPrice", data.sellingPrice);
  67  |   await page.fill("#originalPrice", data.originalPrice);
  68  |   await page.fill("#college", data.college);
  69  |   await page.fill("#branch", data.branch);
  70  |   await page.fill("#semester", data.semester);
  71  |   await page.fill("#city", data.city);
  72  |   await page.fill("#sellerName", data.sellerName);
  73  |   await page.fill("#sellerPhone", data.sellerPhone);
  74  |   await page.fill("#whatsappNumber", data.whatsappNumber);
  75  |   await page.fill("#email", data.email);
  76  | 
  77  |   const description = page.locator("#description");
  78  |   await description.fill(data.description);
  79  | 
  80  |   await page.selectOption("select#category", data.category);
  81  |   await page.selectOption("select#condition", data.condition);
  82  | 
  83  |   await page.locator(`label:has-text('${data.contactPreference}')`).click();
  84  | 
  85  |   await page.click("button:has-text('Publish Book')");
  86  |   await page.waitForURL("/dashboard", { timeout: 15000 });
  87  | }
  88  | 
  89  | test.describe("Authentication", () => {
  90  |   test("Register a new user", async ({ page }) => {
  91  |     await registerUser(page, USER.name, USER.email, USER.password);
  92  |   });
  93  | 
  94  |   test("Login with registered user", async ({ page }) => {
  95  |     await page.context().addInitScript(() => {
  96  |       const users: Record<string, { id: string; email: string; password: string; full_name: string; created_at: string }> = {};
  97  |       users["test@example.com"] = {
  98  |         id: crypto.randomUUID(),
  99  |         email: "test@example.com",
  100 |         password: "TestPass123!",
  101 |         full_name: "Test User",
  102 |         created_at: new Date().toISOString(),
  103 |       };
  104 |       localStorage.setItem("silentpsy-demo-users", JSON.stringify(users));
  105 |     });
  106 |     await loginUser(page, USER.email, USER.password);
  107 |   });
  108 | 
  109 |   test("Login with redirect param", async ({ page }) => {
  110 |     await page.context().addInitScript(() => {
  111 |       const users: Record<string, { id: string; email: string; password: string; full_name: string; created_at: string }> = {};
  112 |       users["test@example.com"] = {
  113 |         id: crypto.randomUUID(),
  114 |         email: "test@example.com",
  115 |         password: "TestPass123!",
  116 |         full_name: "Test User",
  117 |         created_at: new Date().toISOString(),
  118 |       };
  119 |       localStorage.setItem("silentpsy-demo-users", JSON.stringify(users));
  120 |     });
  121 |     await page.goto("/dashboard");
  122 |     await page.waitForURL(/\/login/, { timeout: 10000 });
  123 |     await page.fill("#email", USER.email);
  124 |     await page.fill("#password", USER.password);
  125 |     await page.click("button:has-text('Continue')");
  126 |     await page.waitForURL("/dashboard", { timeout: 10000 });
  127 |     await expect(page.locator("text=Premium seller dashboard")).toBeVisible({ timeout: 5000 });
  128 |   });
  129 | 
  130 |   test("Forgot password flow", async ({ page }) => {
  131 |     await page.context().addInitScript(() => {
  132 |       const users: Record<string, { id: string; email: string; password: string; full_name: string; created_at: string }> = {};
  133 |       users["test@example.com"] = {
  134 |         id: crypto.randomUUID(),
  135 |         email: "test@example.com",
  136 |         password: "TestPass123!",
  137 |         full_name: "Test User",
  138 |         created_at: new Date().toISOString(),
  139 |       };
  140 |       localStorage.setItem("silentpsy-demo-users", JSON.stringify(users));
  141 |     });
  142 |     await page.goto("/forgot-password");
  143 |     await expect(page.locator("h1")).toContainText("Recover your account");
  144 |     await page.fill("#email", USER.email);
  145 |     await page.click("button:has-text('Send reset link')");
  146 |     await expect(page.locator("text=Password reset link prepared")).toBeVisible({ timeout: 5000 });
  147 |   });
  148 | 
  149 |   test("Google OAuth button is present", async ({ page }) => {
  150 |     await page.goto("/login");
  151 |     await expect(page.locator("text=Sign in with Google")).toBeVisible();
  152 |   });
  153 | 
  154 |   test("Logout flow", async ({ page }) => {
  155 |     await registerUser(page, "Logout User", "logout@example.com", USER.password);
  156 |     await page.goto("/");
  157 |     const avatar = page.locator("button:has-text('LO')");
  158 |     await expect(avatar).toBeVisible({ timeout: 5000 });
  159 |     await avatar.click();
> 160 |     await page.locator("button:has-text('Sign out')").click();
      |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  161 |     await page.waitForURL("/", { timeout: 10000 });
  162 |     await page.goto("/dashboard");
  163 |     await page.waitForURL(/\/login/, { timeout: 10000 });
  164 |   });
  165 | });
  166 | 
  167 | test.describe("Sell Book Flow", () => {
  168 |   test("Sell book form - fill and publish", async ({ page }) => {
  169 |     await registerUser(page, USER.name, `sell-${Date.now()}@example.com`, USER.password);
  170 |     await publishBook(page);
  171 |     await expect(page.locator(`text=${BOOK.title}`).first()).toBeVisible({ timeout: 5000 });
  172 |   });
  173 | 
  174 |   test("Image upload and preview on sell page", async ({ page }) => {
  175 |     await registerUser(page, USER.name, `img-${Date.now()}@example.com`, USER.password);
  176 |     await page.goto("/sell");
  177 |     await expect(page.locator("text=List your second-hand book")).toBeVisible();
  178 |     const fileInput = page.locator("input[type='file']");
  179 |     const testImagePath = path.resolve("public/test-book.png");
  180 |     await fileInput.setInputFiles(testImagePath);
  181 |     await page.waitForTimeout(1000);
  182 |     const previewImage = page.locator("img[alt='Primary preview']");
  183 |     await expect(previewImage).toBeVisible({ timeout: 5000 });
  184 |     await expect(page.locator("text=Listing preview")).toBeVisible();
  185 |   });
  186 | 
  187 |   test("Edit a listing", async ({ page }) => {
  188 |     const email = `edit-${Date.now()}@example.com`;
  189 |     await registerUser(page, USER.name, email, USER.password);
  190 |     await publishBook(page);
  191 |     await page.waitForTimeout(500);
  192 |     const editLink = page.locator(`a[href*='/sell?id=']`).first();
  193 |     await expect(editLink).toBeVisible({ timeout: 5000 });
  194 |     await editLink.scrollIntoViewIfNeeded();
  195 |     await editLink.click();
  196 |     await page.waitForURL(/\/sell\?id=/, { timeout: 10000 });
  197 |     await page.waitForTimeout(500);
  198 |     const updatedTitle = `${BOOK.title} (Updated)`;
  199 |     await page.fill("#title", "");
  200 |     await page.fill("#title", updatedTitle);
  201 |     await page.click("button:has-text('Publish Book')");
  202 |     await page.waitForURL("/dashboard", { timeout: 15000 });
  203 |     await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible({ timeout: 5000 });
  204 |   });
  205 | 
  206 |   test("Delete a listing", async ({ page }) => {
  207 |     const email = `del-${Date.now()}@example.com`;
  208 |     await registerUser(page, USER.name, email, USER.password);
  209 |     await publishBook(page);
  210 |     await page.waitForTimeout(500);
  211 |     page.on("dialog", (dialog) => dialog.accept());
  212 |     const deleteBtn = page.locator("button:has-text('Delete')").first();
  213 |     await expect(deleteBtn).toBeVisible({ timeout: 5000 });
  214 |     await deleteBtn.scrollIntoViewIfNeeded();
  215 |     await deleteBtn.click();
  216 |     await page.waitForTimeout(1000);
  217 |     await expect(page.locator(`text=${BOOK.title}`)).not.toBeVisible();
  218 |   });
  219 | });
  220 | 
  221 | test.describe("Browse Books", () => {
  222 |   test("Books page loads and shows listings", async ({ page }) => {
  223 |     await page.goto("/books");
  224 |     await expect(page.locator("text=Book marketplace")).toBeVisible();
  225 |     await page.waitForTimeout(2000);
  226 |     await expect(page.locator("text=Live listings")).toBeVisible();
  227 |   });
  228 | 
  229 |   test("Search books", async ({ page }) => {
  230 |     await page.goto("/books");
  231 |     await page.waitForTimeout(1000);
  232 |     const searchInput = page.locator("input[aria-label='Search books']");
  233 |     await expect(searchInput).toBeVisible();
  234 |     await searchInput.fill("Engineering");
  235 |     await page.waitForTimeout(1500);
  236 |     const bookCards = page.locator("article");
  237 |     const count = await bookCards.count();
  238 |     expect(count).toBeGreaterThan(0);
  239 |   });
  240 | 
  241 |   test("Filter by category", async ({ page }) => {
  242 |     await page.goto("/books");
  243 |     await page.waitForTimeout(1000);
  244 |     const categorySelect = page.locator("select[aria-label='Filter by category']");
  245 |     await categorySelect.selectOption("Engineering");
  246 |     await page.waitForTimeout(1000);
  247 |   });
  248 | 
  249 |   test("Filter by condition", async ({ page }) => {
  250 |     await page.goto("/books");
  251 |     await page.waitForTimeout(1000);
  252 |     const conditionSelect = page.locator("select[aria-label='Filter by condition']");
  253 |     await conditionSelect.selectOption("Good");
  254 |     await page.waitForTimeout(1000);
  255 |   });
  256 | 
  257 |   test("Sort books", async ({ page }) => {
  258 |     await page.goto("/books");
  259 |     await page.waitForTimeout(1000);
  260 |     const sortSelect = page.locator("select[aria-label='Sort books']");
```