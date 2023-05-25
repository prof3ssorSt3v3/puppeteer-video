/*
test interactions with a form and ui elements
https://youtube.com/
Get a screenshot and a blurred screenshot
Complete and submit the search form with value from cli or env
'#search-input #search' and '#search-icon-legacy'
screenshot of search results
output text from firstMatch 'ytd-video-renderer h3 a#video-title'
click on firstMatch, navigate
click on dismiss button for login '#dismiss-button'
wait for and check number of comments `ytd-comments-header-renderer h2`
screenshot of video playing
get text for first suggested 'ytd-compact-video-renderer'
output comment count and first suggested video title
*/

import puppeteer from 'puppeteer';
const log = console.log;
const searchTermCLI = process.argv.length >= 3 ? process.argv[2] : 'Volbeat';
const searchTermENV = process.env.SEARCHTXT ?? 'Volbeat';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 1000,
    deviceScaleFactor: 1,
  });

  await page.goto('https://www.youtube.com/');
  await page.waitForSelector('#search-input #search');
  await page.type('#search-input #search', searchTermCLI, { delay: 100 });
  await page.emulateVisionDeficiency('blurredVision');
  await page.screenshot({ path: './screens/youtube-homeblurred.jpg' });
  await page.emulateVisionDeficiency('none');
  await page.screenshot({ path: './screens/youtube-home.jpg' });
  await Promise.all([page.waitForNavigation(), page.click('#search-icon-legacy')]);
  //wait till next page
  await page.waitForSelector('ytd-video-renderer h3 a#video-title');
  await page.screenshot({ path: './screens/search-results.jpg' });

  const firstMatch = await page.$eval('ytd-video-renderer h3 a#video-title', (elem) => {
    //runs when that a#video-title is found
    return elem.innerText;
  });
  console.log({ firstMatch });
  await Promise.all([
    page.waitForNavigation(), //waitForNetworkIdle()
    page.click('ytd-video-renderer h3 a#video-title'),
    new Promise((resolve) => setTimeout(resolve, 17000)),
  ]);
  await page.screenshot({ path: './screens/first-video.jpg' });
  await page.waitForSelector('ytd-comments-header-renderer');
  const videoComments = await page.$eval('ytd-comments-header-renderer h2', (h2) => {
    return h2.innerText;
  });
  console.log({ videoComments });
  const firstSuggested = await page.$eval('ytd-compact-video-renderer', (elem) => {
    return elem.querySelector('h3').innerText;
  });
  console.log({ firstSuggested });

  await browser.close();
})();
