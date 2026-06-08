const { chromium } = require('playwright');

(async () => {
  const launchOptions = {
    headless: false,
    channel: 'chrome', // Usar el Google Chrome real instalado en el Mac
    ignoreDefaultArgs: ['--enable-automation'], // Ocultar el mensaje de "Un software de pruebas..."
    args: [
      '--disable-blink-features=AutomationControlled' // Intentar saltarse la protección de Google
    ]
  };

  console.log("Abriendo Navegador (Chrome Real) para Usuario A...");
  const browserA = await chromium.launchPersistentContext('./playwright_data_a', launchOptions);
  const pageA = await browserA.newPage();
  await pageA.goto('http://localhost:3005');

  console.log("Abriendo Navegador (Chrome Real) para Usuario B...");
  const browserB = await chromium.launchPersistentContext('./playwright_data_b', launchOptions);
  const pageB = await browserB.newPage();
  await pageB.goto('http://localhost:3005');

  console.log("¡Navegadores abiertos con escudos anti-bot activados!");
  
  await Promise.all([
    new Promise(resolve => browserA.on('close', resolve)),
    new Promise(resolve => browserB.on('close', resolve))
  ]);
  
  console.log("Ambos navegadores cerrados. Sesiones guardadas correctamente.");
})();
