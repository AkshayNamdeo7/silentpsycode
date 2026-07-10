# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: marketplace.spec.ts >> Authentication >> Forgot password flow
- Location: e2e\marketplace.spec.ts:130:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Password reset link prepared')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Password reset link prepared')

```

```yaml
- main:
  - paragraph: Reset password
  - heading "Recover your account" [level=1]
  - paragraph: Enter your email address and we’ll send a secure password reset link to your inbox.
  - text: Email address
  - textbox "Email address":
    - /placeholder: you@example.com
    - text: test@example.com
  - button "Send reset link"
  - paragraph: Password reset email sent. Check your inbox.
  - paragraph:
    - text: Remembered your password?
    - link "Sign in":
      - /url: /login
- alert
```

# Test source

```ts
  46  |   await page.fill("#password", password);
  47  |   await page.click("button:has-text('Continue')");
  48  |   await page.waitForURL("/dashboard", { timeout: 10000 });
  49  |   await expect(page.locator("text=Premium seller dashboard")).toBeVisible({ timeout: 5000 });
  50  | }
  51  | 
  52  | async function publishBook(page: typeof test.prototype.page, overrides: Record<string, string> = {}) {
  53  |   const data = { ...BOOK, ...overrides };
  54  |   await page.goto("/sell");
  55  |   await expect(page.locator("text=List your second-hand book")).toBeVisible();
  56  | 
  57  |   const fileInput = page.locator("input[type='file']");
  58  |   const testImagePath = path.resolve("public/test-book.png");
  59  |   await fileInput.setInputFiles(testImagePath);
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
> 146 |     await expect(page.locator("text=Password reset link prepared")).toBeVisible({ timeout: 5000 });
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
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
  160 |     await page.locator("button:has-text('Sign out')").click();
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
```