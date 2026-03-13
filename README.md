# Playwright Test Suite for openledger.vn

Dự án này chứa bộ test tự động sử dụng Playwright để kiểm tra các luồng nghiệp vụ trên trang `https://a2.openledger.vn/`.

## Các tính năng chính
- Tự động tạo Dự án với tên tăng dần.
- Tự động tạo Feature và điền nội dung PRD.
- Chờ AI sinh test và tự động Duyệt (Approve).
- Quản lý session giúp tái sử dụng trạng thái đăng nhập, không cần login lại nhiều lần.

---

## Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js (phiên bản 16 trở lên).
- npm hoặc yarn.

### 2. Clone và cài đặt thư viện
```bash
git clone <repository_url>
cd TestBAS
npm install
npx playwright install
```
---

## Cách chạy Test

### Bước 1: Khởi tạo Session (Đăng nhập)
Trước khi chạy các test case, bạn cần tạo phiên đăng nhập (chỉ cần chạy 1 lần). 
```bash
npx ts-node login.ts
```
Script sẽ tự động mở trình duyệt, tiến hành đăng nhập vào BAS thủ công => hệ thống tự động lưu session vào file `auth.json`.

### Bước 2: Chạy test
**Chạy toàn bộ luồng (Full Flow):**
```bash
npx playwright test tests/full-flow-test.spec.ts --project=chromium --headed
```
*Luồng này bao gồm: Tạo dự án -> Tạo feature -> Điền PRD -> Chờ Duyệt.*

**Chạy riêng module Quản lý dự án:**
```bash
npx playwright test tests/prj_management/TC-PROJ-01.spec.ts --project=chromium --headed
```

**Chạy riêng module Quản lý feature:**
```bash
npx playwright test tests/prj_management/TC-PROJ-02.spec.ts --project=chromium --headed
```

---

## Cấu trúc thư mục
- `tests/`: Chứa các file kịch bản test `.spec.ts`.
- `login.ts`: Script hỗ trợ tạo phiên đăng nhập.
- `auth.json`: File lưu trữ session (đã bị ignore).
- `full-flow-test-index.json`: Lưu trữ số thứ tự dự án/feature cho lần chạy tiếp theo.

---

## Lưu ý quan trọng
- Các file `*-index.json` được dùng để đảm bảo tên Dự án và Feature không bị trùng lặp. Bạn có thể xóa các file này nếu muốn bắt đầu đếm lại từ 1.
- Nếu session hết hạn, hãy thực hiện lại **Bước 1** để cập nhật `auth.json`.
