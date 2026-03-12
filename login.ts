import { chromium } from '@playwright/test';

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const context = await browser.newContext();
    const page = await context.newPage();

    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;

    await page.goto('https://a2.openledger.vn/login');
    console.log('Đăng nhập bằng Google...');

    await page.waitForURL('https://a2.openledger.vn/', { timeout: 120000 });

    await context.storageState({ path: 'auth.json' });
    console.log('Phiên đăng nhập đã được lưu vào auth.json');

    await browser.close();
})();