import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
  executablePath: 'C:/Users/FabFiller/.cache/puppeteer/chrome/win64-148.0.7778.167/chrome-win64/chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

await page.screenshot({ path: 'temporary screenshots/screenshot-6-nav-hero.png', clip: { x: 0, y: 0, width: 1440, height: 90 } });

await page.evaluate(() => {
  document.querySelector('nav').classList.remove('nav-hero');
  document.querySelector('.nav-cta').classList.add('cta-visible');
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'temporary screenshots/screenshot-7-nav-scrolled.png', clip: { x: 0, y: 0, width: 1440, height: 90 } });

await browser.close();
console.log('done');
