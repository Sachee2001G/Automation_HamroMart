import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://mart-uat.hamrostack.com/");

  const pageTitle = await page.title();
  console.log("Page Title is:", pageTitle);

  await expect(page).toHaveTitle("Hamro Mart | Online Shopping Nepal");

  const pageURL = page.url();
  console.log("Page URL is:", pageURL);

  await expect(page).toHaveURL("https://mart-uat.hamrostack.com/");

  // Click on My Account / Profile icon
  await page
    .locator(
      "//div[@class='w-6 h-6 md:w-7 md:h-7 p-0']//img[@class='object-cover w-full h-full false']",
    )
    .click();

  await page.waitForLoadState("networkidle");

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

  await page.getByText("HAMRO MART", { exact: true }).click();

  //  All products inside grid
  const products = page.locator("div.grid-layout.svelte-l0bug1 a");

  const count = await products.count();
  console.log(`Total products found: ${count}`);

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);

    // Optional: ensure product is visible
    await expect(product).toBeVisible();

    // Wishlist inside each product
    const wishlistIcon = product.locator("button svg, svg");

    await expect(wishlistIcon.first()).toBeVisible();

    console.log(`Wishlist exists in product ${i + 1}`);
  }
});
