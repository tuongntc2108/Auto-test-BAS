import { test, expect } from '@playwright/test';
import fs from 'fs';

test.use({ storageState: 'auth.json' });

test('test', async ({ page }) => {
        // Tăng timeout lên 40 phút (2400000ms) vì có 2 lần chờ 7 phút
        test.setTimeout(2400000);

        // 1. Xử lý tăng số thứ tự cho Dự án và Feature trong file index riêng
        const stateFile = 'full-flow-test-index.json';
        let projectIndex = 3;
        let featureIndex = 3;

        if (fs.existsSync(stateFile)) {
                try {
                        const data = fs.readFileSync(stateFile, 'utf-8');
                        const json = JSON.parse(data);
                        projectIndex = json.projectIndex || 3;
                        featureIndex = json.featureIndex || 3;
                } catch (e) {
                        console.error('Lỗi đọc file full-flow-test-index.json:', e);
                }
        }

        const nextProjectIndex = projectIndex + 1;
        const nextFeatureIndex = featureIndex + 1;

        const projectName = `Test full luồng dự án ${nextProjectIndex}`;
        const featureName = `Test full luồng feature ${nextFeatureIndex}`;
        const projectDesc = `Mô tả test full luồng dự án ${nextProjectIndex}`;
        const featureDesc = `Mô tả test full luồng feature ${nextFeatureIndex}`;

        // Lưu lại index mới
        fs.writeFileSync(stateFile, JSON.stringify({
                projectIndex: nextProjectIndex,
                featureIndex: nextFeatureIndex
        }, null, 2));

        console.log(`Bắt đầu chạy test: ${projectName} -> ${featureName}`);

        await page.goto('https://a2.openledger.vn/');

        // Tạo dự án mới
        await page.getByRole('button', { name: 'Tạo dự án mới' }).click();
        await page.getByRole('textbox', { name: 'Nhập tên project...' }).fill(projectName);
        await page.getByRole('textbox').nth(2).fill(projectDesc);
        await page.getByRole('button', { name: 'Tạo Project' }).click();

        // Tạo feature mới trong dự án vừa tạo
        await page.getByRole('button', { name: 'Tạo feature mới' }).first().click();
        await page.getByRole('textbox', { name: 'Enter feature name...' }).fill(featureName);
        await page.getByRole('textbox', { name: 'Brief description...' }).fill(featureDesc);
        await page.getByRole('button', { name: 'Tiếp tục' }).click();

        await page.getByRole('tab', { name: '🔗 Confluence' }).click();
        await page.getByRole('textbox', { name: 'Enter Confluence page URL...' }).click();
        await page.getByRole('textbox', { name: 'Enter Confluence page URL...' }).fill('https://wiki.servicehub.vn/spaces/BAS/pages/908989488/SDK+Vi%E1%BB%85n+th%C3%B4ng_PRD+Overview');
        await page.getByRole('button', { name: '☁ Fetch Content' }).click();
        await page.getByRole('button', { name: 'Create Feature' }).click();

        // Chờ AI sinh test và thực hiện Duyệt 2 lần (mỗi 2 phút reload 1 lần)
        let duyệtCount = 0;
        while (duyệtCount < 2) {
                console.log(`Đang chờ 2 phút để kiểm tra trạng thái (Duyệt lần ${duyệtCount + 1})...`);
                await page.waitForTimeout(2 * 60 * 1000);

                let isLoaded = false;
                while (!isLoaded) {
                        await page.reload();
                        await page.waitForTimeout(3000);
                        console.log('Đã reload trang, đang kiểm tra trạng thái load...');
                        try {
                                // Kiểm tra xem button "Duyệt" có tồn tại (không cần enable) để xác nhận trang không trắng
                                await expect(page.getByRole('button', { name: 'Duyệt' })).toBeAttached({ timeout: 10000 });
                                isLoaded = true;
                        } catch (e) {
                                console.log('Trang bị lỗi trắng trang, đang reload lại...');
                        }
                }

                const btnDuyet = page.getByRole('button', { name: 'Duyệt' });
                if (await btnDuyet.isEnabled()) {
                        await btnDuyet.click();
                        duyệtCount++;
                        console.log(`Đã nhấn Duyệt lần ${duyệtCount}.`);
                } else {
                        console.log('Button "Duyệt" chưa sẵn sàng (chưa enabled).');
                }
        }
        console.log('Đã hoàn thành 2 lần Duyệt. Luồng kết thúc.');
});