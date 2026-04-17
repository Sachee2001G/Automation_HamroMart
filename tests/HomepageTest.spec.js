import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://mart-uat.hamrostack.com/");

  // Title & URL validation
  await expect(page).toHaveTitle("Hamro Mart | Online Shopping Nepal");
  await expect(page).toHaveURL("https://mart-uat.hamrostack.com/");

  console.log("Page Title is:", await page.title());
  console.log("Page URL is:", page.url());

  // Click profile icon (still fragile, improve later if possible)
  await page.locator("//div[contains(@class,'w-6')]//img").first().click();

  await page.waitForLoadState("networkidle");

  // Login check
  const isLoggedIn = await page
    .locator("text=Logout")
    .isVisible()
    .catch(() => false);

  if (isLoggedIn) {
    console.log("User is logged in");
    await expect(page.getByText("Log out")).toBeVisible();
  } else {
    console.log("User is not logged in");
  }

  //  Go back to homepage
  await page.getByText("HAMRO MART", { exact: true }).click();

  // Go to cart
  await page.locator("svg").locator("path").nth(2).click();
  await page.waitForLoadState("networkidle");

  const emptyText = page.getByText("No items found in cart!", { exact: true });
  const removeBtn = page.getByRole("button", { name: "Remove Items" });

  // Clean cart if needed
  if (await emptyText.isVisible().catch(() => false)) {
    console.log("Cart is already empty");
  } else {
    console.log("Cart has items → removing");

    if ((await removeBtn.count()) > 0) {
      await removeBtn.first().click();
      await page.getByRole("button", { name: /yes/i }).click();
      await expect(emptyText).toBeVisible();
    }
  }

  // Back to dashboard
  await page.getByRole("link", { name: "Continue shopping" }).click();

  // Locate all products
  const products = page.locator("div.grid-layout a");

  // Wait for products to load
  await expect(products.first()).toBeVisible();

  const count = await products.count();
  console.log(`Total products found: ${count}`);

  // 1. Validate wishlist exists for ALL products
  for (let i = 0; i < count; i++) {
    const product = products.nth(i);

    const wishlistIcon = product.locator("button svg, svg");

    await expect(wishlistIcon.first()).toBeVisible();

    console.log(`Wishlist exists in product ${i + 1}`);
  }

  // 2. Pick ONE random product (after loop)
  const randomIndex = Math.floor(Math.random() * count);
  const randomProduct = products.nth(randomIndex);

  console.log(`Clicking random product index: ${randomIndex}`);

  await randomProduct.click();

  await page.waitForLoadState("networkidle");
});
