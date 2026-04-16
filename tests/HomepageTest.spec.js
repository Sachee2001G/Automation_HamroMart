import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://mart-uat.hamrostack.com/");

  const pageTitle = page.title();
  console.log("Page Title is:", pageTitle);

  await expect(page).toHaveTitle("Hamro Mart | Online Shopping Nepal");

  const pageURL = page.url();
  console.log("Page URL is:", pageURL);

  await expect(page).toHaveURL("https://mart-uat.hamrostack.com/");

  await page.close();
});
