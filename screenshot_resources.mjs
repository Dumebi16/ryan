import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3002/resources', { waitUntil: 'networkidle' });
  
  await page.screenshot({ path: 'resources-screenshot.png' });
  
  // also get the number of articles displayed
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.includes('NO ARTICLES PUBLISHED YET'));
  console.log(text.includes('How AI Is Reshaping'));
  
  await browser.close();
})();
