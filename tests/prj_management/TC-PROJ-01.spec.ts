import { test, expect } from '@playwright/test';
import fs from 'fs';

test.use({ storageState: 'auth.json' });

test('test', async ({ page }) => {
  // Đường dẫn file lưu số thứ tự dự án
  const stateFile = 'project-index.json';
  let lastIndex = 0;

  // Đọc số thứ tự lần trước từ file
  if (fs.existsSync(stateFile)) {
    try {
      const data = fs.readFileSync(stateFile, 'utf-8');
      const json = JSON.parse(data);
      lastIndex = json.lastIndex || 0;
    } catch (error) {
      console.error('Lỗi khi đọc file state:', error);
    }
  }

  // Tăng số thứ tự lên
  const nextIndex = lastIndex + 1;
  const projectName = `Test dự án ${nextIndex}`;

  // Cập nhật lại file state sau khi đã lấy số mới
  fs.writeFileSync(stateFile, JSON.stringify({ lastIndex: nextIndex }, null, 2));

  console.log(`Bắt đầu chạy test với: ${projectName}`);

  await page.goto('https://a2.openledger.vn/');
  await page.getByRole('button', { name: 'Tạo dự án mới' }).click();
  await page.getByRole('textbox', { name: 'Nhập tên project...' }).click();
  await page.getByRole('textbox', { name: 'Nhập tên project...' }).fill(projectName);
  await page.getByRole('paragraph').click();
  await page.getByRole('textbox').nth(2).fill(`Mô tả cho ${projectName}`);
  await page.getByRole('button', { name: 'Tạo Project' }).click();
});