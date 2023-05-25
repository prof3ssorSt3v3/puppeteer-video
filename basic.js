// Puppeteer and Headless Chrome (or Firefox)
// npm init -y
// add "type":"module" to package.json
// npm install puppeteer@19.11.1

import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, isMobile: false, isLandscape: true, hasTouch: false, deviceScaleFactor: 1 });
  await page.setGeolocation({ latitude: 49.5, longitude: 100.0 });

  await page.goto('https://chapters.indigo.ca/');

  const url = await page.url();
  console.log(url);
  const content = await page.content();
  console.log(content);

  await page.screenshot({ path: './screens/samplechapters1.jpg', fullPage: true });
  await page.screenshot({ path: './screens/samplechapters2.jpg', clip: { x: 200, y: 200, width: 500, height: 500 }, encoding: 'binary', type: 'jpeg' });

  // await page.type('input.selector', 'text');
  // await page.waitForSelector('.someselector')

  await browser.close();
})();
