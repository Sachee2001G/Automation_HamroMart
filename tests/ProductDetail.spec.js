import { test, expect } from "@playwright/test";

test("Product detail validation", async ({ page }) => {
  await page.goto(
    "https://mart-uat.hamrostack.com/-NwyUBP0kucDlS2mZShz/product/cmVhY3Rpb24vcHJvZHVjdDptS0JQakJqYks0aG5qZGtjSA==_0kucDlS2",
  );

  // EXPECTED PRODUCT to be validated against actual product name on page

  const expectedProductName = "Heart Shaped Box Chocolate";

  // ACTUAL PRODUCT NAME on product detail page

  const actualName = (await page.locator("h1").first().textContent())?.trim();

  console.log("Expected:", expectedProductName);
  console.log("Actual:", actualName);

  expect(actualName).toContain(expectedProductName);

  // PRICE VALIDATION - Extracting price text and cleaning it to get numeric value

  const priceLocator = page.locator("text=/Rs\\./").first();

  await expect(priceLocator).toBeVisible();

  const price = (await priceLocator.textContent())?.trim();
  console.log("Raw Price:", price);

  const numericPrice = price?.replace("Rs.", "").trim();
  console.log("Clean Price:", numericPrice);

  // ADD TO CART Button validation

  const addToCartBtn = page.getByRole("button", {
    name: /add to cart/i,
  });

  await expect(addToCartBtn).toBeVisible();

  // BUY NOW Button Validation

  const buyNowBtn = page.getByRole("button", {
    name: /buy now/i,
  });

  await expect(buyNowBtn).toBeVisible();

  // WISHLIST ICON button validation

  const wishlistIcon = page.locator("button svg").first();

  await expect(wishlistIcon).toBeVisible();

  // Final Validation log

  console.log("Product Detail Validation Completed");

  // Now click on Add to Cart and validate cart count increment
  await page.getByRole("button", { name: /add to cart/i }).click();

  const batch = page.locator(".coupon-count.svelte-1skedrb");

    await expect(batch).toHaveText("1");
    
    
});
