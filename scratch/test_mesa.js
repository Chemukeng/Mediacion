const { chromium } = require("playwright");
const fs = require("fs");

async function run() {
  console.log("Debugging Mesa page...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  
  page.on("console", msg => console.log(`[Console] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.error(`[PageError] ${err.toString()}`));

  await page.goto("http://localhost:3005/login");
  await page.waitForTimeout(1000);

  const phoneLocator = page.locator("#phone-mockup");

  // Login & link accounts
  console.log("Navigating to invitation...");
  await page.click("button:has-text('1.3. Invitación Receptora'):visible");
  await page.waitForTimeout(1000);
  await page.click("button:has-text('Aceptar Invitación y Unirse'):visible");
  await page.waitForTimeout(1500);

  // Complete Boveda for Marta
  console.log("Finalizing Boveda...");
  await page.click("button:has-text('Finalizar Bóveda (Marta)'):visible");
  await page.waitForTimeout(1000);

  // Go to Mesa via Vestibulo to avoid Framer Motion transition sibling bug
  console.log("Navigating to Vestibulo first...");
  await page.click("button:has-text('2. Vestíbulo (Dashboard)'):visible");
  await page.waitForTimeout(1000);

  console.log("Navigating to Mesa...");
  await page.click("button:has-text('8. Mesa de Negociación'):visible");
  await page.waitForTimeout(2000);

  // Check HTML content of mockup
  const html = await phoneLocator.innerHTML();
  console.log("HTML length:", html.length);
  fs.writeFileSync("scratch/html_debug.txt", html);

  const styleAttr = await page.evaluate(() => {
    const el = document.querySelector("#phone-mockup > div:nth-child(2) > div");
    return el ? el.outerHTML : "Not found";
  });
  console.log("Outer HTML of motion.div:", styleAttr);

  await phoneLocator.screenshot({ path: "scratch/debug_mesa.png" });
  console.log("Saved screenshot to scratch/debug_mesa.png");

  await browser.close();
}

run().catch(console.error);
