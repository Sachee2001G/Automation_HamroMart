import { test, expect } from "@playwright/test";

// Helper functions

function parsePrice(raw) {
  return parseFloat(raw?.replace("Rs.", "").replace(/,/g, "").trim() ?? "0");
}

async function getPrice(page, label) {
  const labelEl = page.locator("p").filter({ hasText: label }).first();
  const priceEl = labelEl.locator("xpath=following-sibling::p[1]");
  const raw = (await priceEl.textContent())?.trim();
  console.log(`${label}: ${raw}`);
  return parsePrice(raw);
}

async function resetQuantityToOne(page) {
  const minusBtn = page.getByRole("button", { name: "-" });
  const qtyEl = page.locator("p").filter({ hasText: /^\d+$/ }).first();

  let qty = parseInt((await qtyEl.textContent())?.trim() ?? "1");
  while (qty > 1) {
    await minusBtn.click();
    await page.waitForTimeout(400);
    qty = parseInt((await qtyEl.textContent())?.trim() ?? "1");
  }
  console.log("Quantity reset to 1");
}

// Performing Test

test("Cart validation", async ({ page }) => {
  await page.goto("https://mart-uat.hamrostack.com/cart");
  await page.waitForLoadState("networkidle");

  // Finding the product in cart and validating details

  //Product name validation

  const expectedName = "Heart Shaped Box Chocolate";
  const nameLocator = page.getByText(expectedName, { exact: true });

  await expect(nameLocator).toBeVisible();
  expect((await nameLocator.textContent())?.trim()).toBe(expectedName);
  console.log("Product name:", expectedName);

  // Product price validation

  const priceEl = page.locator("p").filter({ hasText: /Rs\./ }).first();
  await expect(priceEl).toBeVisible();

  const productPrice = parsePrice((await priceEl.textContent())?.trim());
  expect(productPrice).toBeGreaterThan(0);
  console.log("Product price:", productPrice);

  // To check if quantity is 1 and minus button is disabled, we first reset quantity to 1

  await resetQuantityToOne(page);

  const qtyEl = page.locator("p").filter({ hasText: /^\d+$/ }).first();
  const quantity = parseInt((await qtyEl.textContent())?.trim() ?? "0");

  expect(quantity).toBe(1);
  await expect(page.getByRole("button", { name: "-" })).toBeDisabled();
  console.log("Quantity is 1, minus button is disabled");

  // Order summary validation

  await expect(page.getByText("Order Summary", { exact: true })).toBeVisible();

  const subtotal = await getPrice(page, "Subtotal");
  const shippingCharge = await getPrice(page, "Shipping Charge");
  const orderTotal = await getPrice(page, "Order Total");

  expect(subtotal).toBeGreaterThan(0);
  expect(shippingCharge).toBe(80);
  expect(orderTotal).toBe(subtotal + shippingCharge);
  console.log(
    "Order Summary: subtotal",
    subtotal,
    "| shipping",
    shippingCharge,
    "| total",
    orderTotal,
  );

  // Calculating for Free shipping and validating the message about how much more to add for free shipping

  const FREE_SHIPPING_THRESHOLD = 1000;
  const amountAway = FREE_SHIPPING_THRESHOLD - subtotal;

  const awayMsg = page.locator(`p:has-text("away from Free Shipping")`);
  await expect(awayMsg).toBeVisible();

  const awayMsgText = (await awayMsg.textContent())?.trim();
  console.log("Away message:", awayMsgText);

  const match = awayMsgText?.match(/Rs\.\s*([\d,.]+)/);
  if (match) {
    const msgAmount = parseFloat(match[1].replace(/,/g, ""));
    expect(Math.abs(msgAmount - amountAway)).toBeLessThan(1);
    console.log("Away amount matches:", msgAmount);
  }

  // Verifying free shipping message

  await page.getByRole("button", { name: "+" }).click();
  await page.waitForTimeout(500);

  const updatedSubtotal = await getPrice(page, "Subtotal");
  const updatedTotal = await getPrice(page, "Order Total");

  expect(updatedSubtotal).toBeGreaterThan(FREE_SHIPPING_THRESHOLD);
  expect(updatedTotal).toBe(updatedSubtotal); // no shipping added
  console.log(
    "Updated subtotal:",
    updatedSubtotal,
    "| order total:",
    updatedTotal,
  );

  // Validation Messages for free shipping

  await expect(page.getByText("Rs. 80", { exact: true })).not.toBeVisible();
  console.log("Rs. 80 shipping charge is gone");

  await expect(
    page.getByText("Congratulations! Enjoy your Free Shipping.", {
      exact: true,
    }),
  ).toBeVisible();
  console.log('"Congratulations! Enjoy your Free Shipping." message visible');

  console.log("Cart Validation Completed");
});
