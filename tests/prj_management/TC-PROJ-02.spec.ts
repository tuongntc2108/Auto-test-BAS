import { test, expect } from '@playwright/test';
import fs from 'fs';

test.use({ storageState: 'auth.json' });

test('test', async ({ page }) => {
        // 1. Lấy thông tin dự án hiện tại để click chọn (đọc từ project-index.json)
        const projectStateFile = 'project-index.json';
        let projectIndex = 0;
        if (fs.existsSync(projectStateFile)) {
                const data = fs.readFileSync(projectStateFile, 'utf-8');
                projectIndex = JSON.parse(data).lastIndex || 0;
        }
        const currentProjectName = `Test dự án ${projectIndex}`;

        // 2. Xử lý tăng số thứ tự feature
        const featureStateFile = 'feature-index.json';
        let lastFeatureIndex = 0;

        if (fs.existsSync(featureStateFile)) {
                try {
                        const data = fs.readFileSync(featureStateFile, 'utf-8');
                        lastFeatureIndex = JSON.parse(data).lastIndex || 0;
                } catch (e) {
                        console.error('Lỗi đọc file feature-index.json:', e);
                }
        }

        const nextFeatureIndex = lastFeatureIndex + 1;
        const featureName = `Test feature ${nextFeatureIndex}`;
        const featureDesc = `Mô tả test feature ${nextFeatureIndex}`;

        // Lưu lại index mới
        fs.writeFileSync(featureStateFile, JSON.stringify({ lastIndex: nextFeatureIndex }, null, 2));

        console.log(`Bắt đầu chạy test Feature: ${featureName} cho Dự án: ${currentProjectName}`);

        await page.goto('https://a2.openledger.vn/');

        // Click vào dự án vừa tạo gần nhất
        await page.getByText(currentProjectName).click();

        // Nút tạo feature mới (đã xác định bằng locator ở bước trước)
        await page.locator('div:nth-child(18) > button:nth-child(5)').click();

        await page.getByRole('textbox', { name: 'Enter feature name...' }).click();
        await page.getByRole('textbox', { name: 'Enter feature name...' }).fill(featureName);

        await page.getByRole('textbox', { name: 'Brief description...' }).click();
        await page.getByRole('textbox', { name: 'Brief description...' }).fill(featureDesc);

        await page.getByRole('button', { name: 'Tiếp tục' }).click();


        await page.getByRole('tab', { name: '🔗 Confluence' }).click();
        await page.getByRole('textbox', { name: 'Enter Confluence page URL...' }).click();
        await page.getByRole('textbox', { name: 'Enter Confluence page URL...' }).fill('https://wiki.servicehub.vn/spaces/BAS/pages/908989488/SDK+Vi%E1%BB%85n+th%C3%B4ng_PRD+Overview');
        await page.getByRole('button', { name: '☁ Fetch Content' }).click();

        await page.getByRole('button', { name: 'Create Feature' }).click();

        await page.getByText('Tường Nguyễn Thị Cát').click();
        await page.getByRole('button', { name: 'Đăng xuất' }).click();
});