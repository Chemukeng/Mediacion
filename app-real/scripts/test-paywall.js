const { chromium } = require('playwright');

(async () => {
  console.log("Iniciando prueba de UI del Muro de Pago...");
  
  const launchOptions = {
    headless: true,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled']
  };

  const browserA = await chromium.launchPersistentContext('./playwright_data_a', launchOptions);
  const pageA = await browserA.newPage();
  pageA.setDefaultTimeout(30000);

  try {
    console.log("[1] Usuario A entra al dashboard para buscar su caso...");
    await pageA.goto('http://localhost:3005/dashboard');
    
    // Obtener caseId
    const dashboardText = await pageA.content();
    const match = dashboardText.match(/ID:\s*([a-f0-9\-]{36})/);
    if (!match) throw new Error("No hay expediente activo. Debes correr E2E completo primero.");
    const caseId = match[1];
    
    console.log(`[2] Navegando al Tablón de Mediación: ${caseId}`);
    await pageA.goto(`http://localhost:3005/dashboard/board/${caseId}`);

    // Click en todos los "Estoy de acuerdo" (si no han sido clickados)
    console.log("[3] Aceptando todos los acuerdos...");
    const acceptButtons = pageA.locator('button:has-text("Estoy de acuerdo")');
    const count = await acceptButtons.count();
    
    for (let i = 0; i < count; i++) {
      await acceptButtons.nth(i).click();
      await pageA.waitForTimeout(500); // Dar tiempo al server action
    }

    console.log("[4] Verificando si aparece el Muro de Pago...");
    // Esto podría fallar si el Usuario B no ha aceptado también, pero para la prueba si agreements=0 sale directo.
    // O podemos forzar que el Usuario B acepte si es necesario abriendo su navegador.
    // Como el último E2E falló en la fase dinámica, igual no hay acuerdos o hay 0 acuerdos.
    
    await pageA.waitForSelector('text=Desbloquea el Documento Oficial', { timeout: 10000 });
    console.log("¡El Muro de Pago apareció correctamente!");
    
    console.log("[5] Comprobando Stripe Checkout...");
    // Comprobar que los botones redirigen
    // No haremos click para no salirnos del localhost, pero verificamos que existen
    await pageA.waitForSelector('button:has-text("Pagar todo (500€)")');
    await pageA.waitForSelector('button:has-text("Pagar solo mi mitad (250€)")');
    console.log("Los botones de pago están presentes.");
    
    console.log("Test del Muro de Pago SUPERADO con éxito.");
  } catch (error) {
    console.error("Test falló:", error);
  } finally {
    await browserA.close();
  }
})();
