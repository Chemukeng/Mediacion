const { chromium } = require("playwright");

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("pageerror", (err) => {
    console.error("Client-side error:", err.message);
  });
  
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("Console error:", msg.text());
    }
  });

  console.log("Navigating to http://localhost:3005/login ...");
  await page.goto("http://localhost:3005/login");
  await page.waitForTimeout(2000);
  
  console.log("Closing browser...");
  await browser.close();
}

check().catch(console.error);
