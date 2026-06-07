const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const PRESENTATION_DIR = path.join(__dirname, "../capturas para presentacion");

if (!fs.existsSync(PRESENTATION_DIR)) {
  fs.mkdirSync(PRESENTATION_DIR, { recursive: true });
}

async function run() {
  console.log("Starting presentation screenshots generator...");
  const browser = await chromium.launch({ headless: true });
  
  // Custom screen settings to capture a simulated mobile inside desktop
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  
  const page = await context.newPage();

  // Dismiss all alert dialogs automatically
  page.on("dialog", async (dialog) => {
    console.log(`[Alert Dialog] Auto-accepting: ${dialog.message()}`);
    await dialog.accept();
  });
  
  // Navigate to local dev server
  console.log("Connecting to local web application server...");
  await page.goto("http://localhost:3005/login");
  await page.waitForTimeout(2000);
  
  const phoneFrame = page.locator("#phone-mockup");

  // 1. CAPTURE LOGIN PAGE (01_login.png)
  console.log("Capturing 1. Login page...");
  // Clear any inputs first
  await phoneFrame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await phoneFrame.screenshot({ path: path.join(PRESENTATION_DIR, "01_login.png") });

  // 2. CAPTURE INVITATION RECEPTORA (02_invitacion_receptora.png)
  console.log("Navigating to Invitation Receptora...");
  await page.click("button:has-text('1.3. Invitación Receptora'):visible");
  await page.waitForTimeout(1500);
  console.log("Capturing 2. Invitation Receptora...");
  await phoneFrame.screenshot({ path: path.join(PRESENTATION_DIR, "02_invitacion_receptora.png") });

  // 3. COMPLETE REQUIREMENTS AND GO TO ASISTENTE PROPUESTAS
  console.log("Accepting invitation to connect profiles...");
  await page.click("button:has-text('Aceptar Invitación y Unirse')");
  await page.waitForTimeout(2000);
  
  console.log("Navigating to Asistente de Propuestas...");
  await page.click("button:has-text('7. Asistente Propuestas Chat'):visible");
  await page.waitForTimeout(1500);
  console.log("Capturing 3. AI Asistente de Propuestas...");
  await phoneFrame.screenshot({ path: path.join(PRESENTATION_DIR, "03_asistente_ia_propuestas.png") });

  // 4. NAVIGATE TO MESA DE NEGOCIACIÓN DESBLOQUEADA
  console.log("Unlocking Mesa de Negociacion parameters...");
  // Complete Boveda for Marta
  await page.click("button:has-text('Finalizar Bóveda (Marta)'):visible");
  await page.waitForTimeout(2000);
  
  console.log("Navigating to Mesa de Negociación...");
  await page.click("button:has-text('8. Mesa de Negociación'):visible");
  await page.waitForTimeout(2000);
  console.log("Capturing 4. Mesa de Negociación...");
  await phoneFrame.screenshot({ path: path.join(PRESENTATION_DIR, "04_mesa_negociacion.png") });

  // 5. PAGO DE HONORARIOS RECOMMENDED 50% CARD
  console.log("Agreeing all variables to enable download/payment path...");
  await page.click("button:has-text('Acordar Todo (100% Progreso)'):visible");
  await page.waitForTimeout(500);
  
  console.log("Simulating KYC validation...");
  await page.click("button:has-text('Verificar Identidad (KYC)'):visible");
  await page.waitForTimeout(500);
  
  console.log("Bypassing signing pages to reach Payment screen...");
  await page.click("button:has-text('11. Pago de Honorarios'):visible");
  await page.waitForTimeout(1500);
  console.log("Capturing 5. Pago de Honorarios Premium Card...");
  await phoneFrame.screenshot({ path: path.join(PRESENTATION_DIR, "05_pago_honorarios.png") });

  console.log("Screenshots captured successfully!");
  await browser.close();
}

run().catch(err => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
