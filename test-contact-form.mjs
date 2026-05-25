import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3002/contact', { waitUntil: 'networkidle' });
  
  // Fill first name, last name, phone
  await page.fill('#firstName', 'John');
  await page.fill('#lastName', 'Doe');
  await page.fill('#phone', '123');
  
  // Click submit
  await page.click('button[type="submit"]');
  
  // Wait for a moment to let React state update
  await page.waitForTimeout(500);
  
  // Extract all text-red-400 paragraphs
  const errors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.text-red-400')).map(e => e.innerText);
  });
  
  console.log('Errors found:', errors);
  
  await browser.close();
})();
