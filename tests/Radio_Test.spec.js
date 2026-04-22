const { test } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

test("Export Radio Audit to CSV", async ({ page }) => {
  // 1. Increase timeout to allow for multiple stations
  test.setTimeout(30000000);

  const filePath = path.join(__dirname, "radio_audit_report.csv");

  // 2. Initialize CSV file with headers
  const header = "Radio Station,Streaming URL,Status Code,Failure Message\n";
  fs.writeFileSync(filePath, header);

  await page.goto("https://app.hamropatro.com/radio");
  await page.waitForTimeout(3000);

  const radioButtons = page.locator(
    "div[class='border-t border-zinc-800 pt-4'] button",
  );
  const errorToast = page.locator(
    "div.bg-zinc-900\\/95.border.border-primary\\/30.rounded-xl.p-3.shadow-xl.backdrop-blur-sm.flex.items-center.gap-3.svelte-two0uu:visible",
  );

  // Adjust the '10' to radioButtons.count() if you want to test everything
  for (let i = 0; i < 100; i++) {
    const station = radioButtons.nth(i);
    const stationName = (await station.innerText()).trim();

    console.log(`Auditing: ${stationName}...`);

    const responsePromise = page
      .waitForResponse(
        (response) =>
          response.request().resourceType() === "media" ||
          response.url().includes(".mp3") ||
          response.url().includes("m3u8") ||
          response.url().includes("stream"),
        { timeout: 8000 },
      )
      .catch(() => null);

    await station.click();
    const response = await responsePromise;

    const streamUrl = response ? response.url() : "N/A";
    const statusCode = response ? response.status() : "TIMEOUT";

    // Wait for UI to catch up
    await page.waitForTimeout(1500);
    const isErrorVisible = await errorToast.isVisible();
    const failureMessage = isErrorVisible
      ? (await errorToast.innerText()).replace(/\n/g, " ").trim()
      : statusCode === 200 || statusCode === 206
        ? "Success"
        : "No Stream Detected";

    // 3. Format row for CSV (Wrapping in quotes to handle commas in names/messages)
    const csvRow = `"${stationName}","${streamUrl}","${statusCode}","${failureMessage}"\n`;

    // 4. Append to file immediately (Real-time saving)
    fs.appendFileSync(filePath, csvRow);
  }

  console.log(`\n✅ Audit Complete!`);
  console.log(`CSV Report generated at: ${filePath}`);
});
