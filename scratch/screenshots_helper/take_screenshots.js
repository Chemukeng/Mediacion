const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const CAPTURES_DIR = path.join(__dirname, "../../capturas");

if (!fs.existsSync(CAPTURES_DIR)) {
  fs.mkdirSync(CAPTURES_DIR, { recursive: true });
}

async function run() {
  console.log("Starting screenshot generator script...");
  const browser = await chromium.launch({ headless: true });
  
  // Set a standard desktop viewport so the sidebar is visible
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  
  const page = await context.newPage();

  // Dialog handler to auto-dismiss all browser alerts
  page.on("dialog", async (dialog) => {
    console.log(`[Dialog] Auto-dismissing: ${dialog.message()}`);
    await dialog.dismiss();
  });
  
  // Navigate to login
  console.log("Navigating to login page...");
  await page.goto("http://localhost:3005/login");
  await page.waitForTimeout(2000);
  
  const phoneLocator = page.locator("#phone-mockup");
  
  // Screen 1: Login
  console.log("Taking Screen 1 (Login)...");
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "01_login.png") });
  
  // Screen 1.2: Vinculacion Drawer
  console.log("Opening vinculacion drawer...");
  await page.click("button:has-text('Vincular cuenta o enviar invitación')");
  await page.waitForTimeout(800);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "02_login_drawer_vinculacion.png") });
  
  // Close drawer
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  
  // Screen 2: Invitation Emisor (will auto-login)
  console.log("Navigating to Invitation Emisor...");
  await page.click("button:has-text('1.2. Invitación (Emisor)'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "03_invitacion_emisor_formulario.png") });
  
  // Enter partner info and submit
  console.log("Sending invitation...");
  await page.fill("input[placeholder='Ej. David Martín']", "David Martín");
  await page.fill("input[placeholder='david.martin@ejemplo.com']", "david.martin@ejemplo.com");
  await page.click("button:has-text('Enviar Invitación')");
  await page.waitForTimeout(2500); // wait for animation
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "04_invitacion_emisor_pendiente.png") });
  
  // Simulate Ex completing phase
  console.log("Toggling ex completed phase...");
  await page.click("button[title='Desbloquea el Cuestionario Dinámico y la Mesa de Negociación.']:visible");
  await page.waitForTimeout(500);
  
  // Screen 3: Invitation Receptora
  console.log("Navigating to Invitation Receptora...");
  await page.click("button:has-text('1.3. Invitación Receptora'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "05_invitacion_receptora.png") });
  
  // Join / connect
  console.log("Joining from invitation...");
  await page.click("button:has-text('Aceptar Invitación y Unirse')");
  await page.waitForTimeout(2500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "06_vestibulo_dashboard.png") });
  
  // Screen 4: Bóveda list
  console.log("Navigating to Boveda...");
  await page.click("button:has-text('3. Bóveda (Preparación)'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "07_boveda_menu.png") });
  
  // Screen 5: Cuestionario Basico
  console.log("Navigating to Cuestionario Basico...");
  await page.click("button:has-text('4. Cuestionario Básico Form'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "08_cuestionario_basico_formulario.png") });
  
  // Submit basic questionnaire via simulator control
  console.log("Completing basic questionnaire...");
  await page.click("button:has-text('Marcar Cuestionario Básico Listo'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "09_cuestionario_basico_sellado.png") });
  
  // Screen 6: Cuestionario Dinamico
  console.log("Navigating to Cuestionario Dinamico...");
  await page.click("button:has-text('5. Cuestionario Dinámico'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "10_cuestionario_dinamico_formulario.png") });
  
  // Submit dynamic questionnaire via simulator control
  console.log("Completing dynamic questionnaire...");
  await page.click("button:has-text('Marcar Cuestionario Dinámico Listo'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "11_cuestionario_dinamico_sellado.png") });
  
  // Screen 7: Bóveda Chat Privado
  console.log("Navigating to Boveda Chat Privado...");
  await page.click("button:has-text('6. Bóveda Chat Privado'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "12_boveda_chat_privado.png") });
  
  // Screen 8: Asistente Propuestas
  console.log("Navigating to Asistente Propuestas...");
  await page.click("button:has-text('7. Asistente Propuestas Chat'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "13_asistente_propuestas.png") });
  
  // Screen 9: Mesa de Negociacion (Locked)
  console.log("Navigating to Mesa de Negociacion (Locked)...");
  await page.click("button:has-text('8. Mesa de Negociación'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "14_mesa_negociacion_bloqueada.png") });
  
  // Screen 9.5: Certificado MASC
  console.log("Navigating to Certificado MASC...");
  await page.click("button:has-text('8.5. Certificado MASC'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "15_certificado_masc.png") });
  
  // Screen 10: Borrador y Firma (Locked / KYC pending)
  console.log("Navigating to Borrador y Firma...");
  await page.click("button:has-text('9. Borrador y Firma'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "16_borrador_firma_locked.png") });
  
  // Complete Boveda for Marta
  console.log("Finalizing Boveda...");
  await page.click("button:has-text('Finalizar Bóveda (Marta)'):visible");
  await page.waitForTimeout(1000);
  
  // Screen 11: Mesa de Negociacion (Unlocked)
  console.log("Navigating to Mesa de Negociacion (Unlocked)...");
  await page.click("button:has-text('8. Mesa de Negociación'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "17_mesa_negociacion_desbloqueada.png") });

  // Agree all proposals to allow signing
  console.log("Agreeing all proposals...");
  await page.click("button:has-text('Acordar Todo (100% Progreso)'):visible");
  await page.waitForTimeout(1000);
  
  // Screen 12: Borrador y Firma (KYC pending)
  console.log("Navigating to Borrador y Firma (KYC pending)...");
  await page.click("button:has-text('9. Borrador y Firma'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "18_borrador_firma_kyc_pendiente.png") });
  
  // Screen 13: KYC verification screen
  console.log("Navigating to KYC verification...");
  await page.click("button:has-text('13. Verificación Identidad'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "19_verificacion_kyc_inicio.png") });
  
  // Complete KYC auto verify
  console.log("Completing KYC Verification...");
  // Use the reliable Simulation Controls panel button to toggle KYC verification instantly
  await page.click("button:has-text('Verificar Identidad (KYC)'):visible");
  await page.waitForTimeout(2000); // wait for state sync and UI update
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "20_verificacion_kyc_exito.png") });
  
  // Screen 14: Borrador y Firma (Ready to sign)
  console.log("Navigating to Borrador y Firma (Ready to sign)...");
  await page.click("button:has-text('9. Borrador y Firma'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "21_borrador_firma_listo.png") });
  
  // Sign convenio
  console.log("Signing convenio...");
  await page.click("button:has-text('PULSAR PARA FIRMAR')");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "22_borrador_firma_firmado.png") });
  
  // Approve and submit
  console.log("Submitting final agreement...");
  await page.click("button:has-text('Aprobar y Firmar')");
  await page.waitForTimeout(2500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "23_acuerdo_alcanzado.png") });
  
  // Screen 15: Ventajas tramite
  console.log("Navigating to Ventajas Tramite...");
  await page.click("button:has-text('10.5. Ventajas Trámite Legal'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "24_ventajas_tramite.png") });
  
  // Screen 16: Opciones de descarga
  console.log("Navigating to Opciones de Descarga...");
  await page.click("button:has-text('10.8. Opciones de Descarga'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "25_opciones_descarga.png") });
  
  // Screen 17: Pago de honorarios
  console.log("Navigating to Pago de Honorarios...");
  await page.click("button:has-text('11. Pago de Honorarios'):visible");
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "26_pago_honorarios.png") });
  
  // Complete payment
  console.log("Submitting payment...");
  await page.click("button:has-text('Realizar Pago Seguro')");
  await page.waitForTimeout(2500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "27_finalizado_confirmacion.png") });
  
  // Screen 18: Profile panel
  console.log("Navigating to Perfil...");
  await page.click("button:has-text('13. Verificación Identidad'):visible"); // target it to have navigation controls
  await page.waitForTimeout(800);
  // Navigate using the profile link in the bottom navigation menu of the mockup
  const perfilBtn = phoneLocator.locator("a:has-text('PERFIL')").first();
  await perfilBtn.click();
  await page.waitForTimeout(1500);
  await phoneLocator.screenshot({ path: path.join(CAPTURES_DIR, "28_perfil.png") });

  console.log("All screenshots generated successfully in capturas/ directory!");
  await browser.close();
}

run().catch((err) => {
  console.error("Error generating screenshots:", err);
  process.exit(1);
});
