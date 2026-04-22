# Hamro Mart - Playwright Automation Tests

Automated end-to-end tests for [Hamro Mart UAT](https://mart-uat.hamrostack.com/) using Playwright.

---

## Test Files

| File | What it tests |
|---|---|
| `HomepageTest.spec.js` | Title, URL, login check, cart cleanup, product listing, wishlist icons |
| `ProductDetailTest.spec.js` | Product name, price, Add to Cart, Buy Now, wishlist icon, cart badge, popup |
| `AddtoCartTest.spec.js` | Cart product name, price, quantity, order summary, free shipping logic |

---

## Test Coverage

### HomepageTest.spec.js
- Validates page title and URL
- Checks login state via profile icon
- Clears cart if items exist
- Counts all products on the homepage grid
- Validates wishlist icon exists for every product
- Navigates to a specific product by name

### ProductDetailTest.spec.js
- Navigates directly to the product detail page
- Validates product name matches expected
- Extracts and validates product price
- Asserts Add to Cart button is visible
- Asserts Buy Now button is visible
- Asserts wishlist icon is visible
- Clicks Add to Cart and verifies cart badge shows `1`
- Verifies "Product added to cart" popup appears

### AddtoCartTest.spec.js
- Navigates to the cart page
- Validates correct product name is in cart
- Validates product price is greater than 0
- Resets quantity to 1 if needed (handles leftover state from previous runs)
- Asserts minus (`-`) button is disabled at quantity 1
- Validates Order Summary: Subtotal, Shipping Charge (Rs. 80), Order Total
- Validates "X away from Free Shipping" message amount matches calculation
- Clicks `+` to increase quantity and exceed Rs. 1000
- Asserts Rs. 80 shipping charge disappears
- Asserts "Congratulations! Enjoy your Free Shipping." message appears

---

## Setup

### Prerequisites
- Node.js v18+
- npm

### Install dependencies

```bash
npm install
npx playwright install
```

---

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run a specific file:
```bash
npx playwright test HomepageTest.spec.js
npx playwright test ProductDetailTest.spec.js
npx playwright test AddtoCartTest.spec.js
```

Run in headed mode (see the browser):
```bash
npx playwright test --headed
```

Run in debug mode:
```bash
npx playwright test --debug
```

---

## View Test Report

```bash
npx playwright show-report
```

---

## Test Order

Tests are designed to be run in this order for full end-to-end flow: