const { chromium, devices } = require('playwright');

(async () => {
  console.log('Launching browser with Android Chrome emulation...');
  const pixel5 = devices['Pixel 5'];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...pixel5,
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
  });
  const page = await context.newPage();
  
  // Capture console errors
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.error(`BROWSER ERROR: ${err.message}`);
    if (err.stack) console.error(err.stack);
  });

  console.log('Navigating to http://localhost:3005/login ...');
  try {
    await page.goto('http://localhost:3005/login', { waitUntil: 'load', timeout: 10000 });
    console.log('Page loaded successfully.');
    
    // Wait a couple of seconds for hydration
    await page.waitForTimeout(3000);
    
    // Check if React button works
    console.log('Attempting to click React Test button...');
    page.on('dialog', async dialog => {
      console.log(`DIALOG RECEIVED: ${dialog.message()}`);
      await dialog.accept();
    });
    
    await page.click('text=[TEST REACT] Toca aquí segundo');
    console.log('Click executed on React button.');
    
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Error during navigation/interaction:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
