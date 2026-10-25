import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/FabFiller/.cache/puppeteer/chrome/win64-148.0.7778.167/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

// Desktop
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const failed = [];
  page.on('response', res => { if (!res.ok() && res.url().includes('leistung-manuelle-therapie')) failed.push(res.url() + ' -> ' + res.status()); });
  await page.goto('http://localhost:3000/leistungen.html', { waitUntil: 'networkidle2' });
  await page.click('#trigger-manuelle-therapie');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './temporary screenshots/mt-desktop-open.png', fullPage: true });
  console.log('Desktop image request failures:', failed);
  await page.close();
}

// Mobile
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/leistungen.html', { waitUntil: 'networkidle2' });
  await page.click('#trigger-manuelle-therapie');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './temporary screenshots/mt-mobile-open.png', fullPage: true });
  await page.close();
}

await browser.close();
