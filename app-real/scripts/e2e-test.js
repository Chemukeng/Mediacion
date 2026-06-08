const { chromium } = require('playwright');

(async () => {
  console.log("Iniciando prueba E2E de extremo a extremo...");
  
  const launchOptions = {
    headless: true,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled']
  };

  const browserA = await chromium.launchPersistentContext('./playwright_data_a', launchOptions);
  const browserB = await chromium.launchPersistentContext('./playwright_data_b', launchOptions);
  
  const pageA = await browserA.newPage();
  const pageB = await browserB.newPage();
  
  pageA.setDefaultTimeout(30000);
  pageB.setDefaultTimeout(30000);

  try {
    console.log("[2] Usuario A crea expediente...");
    await pageA.goto('http://localhost:3005/dashboard', { waitUntil: 'networkidle' });
    
    // Check if there is an active case already (maybe the delete failed?)
    const activeCase = await pageA.$('text=Tu Expediente Activo');
    if (!activeCase) {
      await pageA.click('button:has-text("Crear nuevo expediente")');
      await pageA.waitForSelector('text=ID:');
    }
    
    const dashboardText = await pageA.content();
    const match = dashboardText.match(/ID:\s*([a-f0-9\-]{36})/);
    if (!match) {
      await pageA.screenshot({ path: 'debug-a.png' });
      throw new Error("No se pudo encontrar el ID del caso en el Dashboard de A");
    }
    const caseId = match[1];
    console.log(`Expediente encontrado: ${caseId}`);

    console.log(`[3] Usuario B acepta invitación en /invite/${caseId}...`);
    await pageB.goto(`http://localhost:3005/invite/${caseId}`);
    await pageB.click('button:has-text("Aceptar Invitación")');
    await pageB.waitForURL('**/dashboard');
    console.log("Usuario B ha entrado al dashboard correctamente.");

    console.log("[4] Ambos usuarios entran al Cuestionario Inicial (Fase 3A)...");
    await pageA.reload();
    
    await Promise.all([
      pageA.click('button:has-text("Ir al Cuestionario Inicial")'),
      pageB.click('button:has-text("Ir al Cuestionario Inicial")')
    ]);

    console.log("[5] Rellenando Cuestionarios Iniciales...");
    async function fillStaticForm(page, income) {
      await page.waitForSelector('input[name="monthly_income"]');
      await page.fill('input[name="monthly_income"]', income);
      // Solo rellenamos ingresos, los hijos/propiedades están ocultos por defecto en "No"
      await page.click('button:has-text("Siguiente Fase (Dinámica)")');
    }
    
    await Promise.all([
      fillStaticForm(pageA, "2000"),
      fillStaticForm(pageB, "1500")
    ]);

    console.log("[6] Esperando Fase Dinámica (Fase 3B)...");
    await Promise.all([
      pageA.waitForURL(`**/dashboard/dynamic/${caseId}`),
      pageB.waitForURL(`**/dashboard/dynamic/${caseId}`)
    ]);

    console.log("[7] La IA genera las preguntas, rellenando respuestas...");
    async function fillDynamicForm(page) {
      await page.waitForSelector('textarea', { state: 'visible', timeout: 60000 });
      const textareas = await page.$$('textarea');
      for (const t of textareas) {
        await t.fill("Estoy de acuerdo con eso");
      }
      await page.click('button:has-text("Enviar Respuestas")');
    }

    await Promise.all([
      fillDynamicForm(pageA),
      fillDynamicForm(pageB)
    ]);

    console.log("[8] Esperando redirección final al Tablón de Mediación (Fase 4)...");
    await Promise.all([
      pageA.waitForURL(`**/dashboard/board/${caseId}`, { timeout: 120000 }),
      pageB.waitForURL(`**/dashboard/board/${caseId}`, { timeout: 120000 })
    ]);

    console.log("[9] ¡ÉXITO! Ambos han llegado al Tablón de Mediación.");
    await pageA.waitForSelector('text=Estoy de acuerdo');
    console.log("TEST FINALIZADO CON ÉXITO.");

  } catch (error) {
    console.error("Test E2E falló:", error);
    await pageA.screenshot({ path: 'debug-a-fail.png' });
    await pageB.screenshot({ path: 'debug-b-fail.png' });
  } finally {
    await browserA.close();
    await browserB.close();
  }
})();
