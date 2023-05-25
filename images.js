/*
Do a search on unsplash.com
Read search term from CLI and create folder
Get copies of the images from the search results
Save them locally in a folder named after search terms 
Get screenshot save in "screens" folder filename search term .png
*/

import puppeteer from 'puppeteer';
import { writeFile } from 'fs';
const searchTermCLI = process.argv.length >= 3 ? process.argv[2] : 'Mountains';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 1000,
    deviceScaleFactor: 1,
  });
  page.on('response', async (resp) => {
    const headers = resp.headers();
    const url = new URL(resp.url());
    if (headers['content-type']?.includes('image/avif') && url.href.startsWith('https://images.unsplash.com/photo-') && headers['content-length'] > 30000) {
      console.log(url.pathname);
      await resp.buffer().then(async (buffer) => {
        await writeFile(`./images/${url.pathname}.avif`, buffer, (err) => {
          if (err) throw err;
        });
      });
    }
  });

  await page.goto('https://www.unsplash.com/');
  await page.screenshot({ path: './screens/unsplashhome.jpg' });
  //'input[data-test="nav-bar-search-form-input"]'
  //'button[data-test="nav-bar-search-form-button"]'
  const btn = await page.waitForSelector('button[data-test="nav-bar-search-form-button"]');
  await page.type('input[data-test="nav-bar-search-form-input"]', searchTermCLI);

  await Promise.all([page.waitForNavigation(), btn.click()]);
  await page.waitForNetworkIdle();
  await page.screenshot({ path: './screens/unsplash-search.jpg', fullPage: true });

  await browser.close();
})();
