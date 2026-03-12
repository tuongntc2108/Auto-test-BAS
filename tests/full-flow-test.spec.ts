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

  const prdContent = `# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Nền Tảng Kiểm Thử Tự Động AI Agent
### (AI Agent Automated Testing Platform — AIATP)

| Trường Thông Tin | Nội Dung |
|:---|:---|
| **Mã Tài Liệu** | PRD-AIATP-2025-001 |
| **Phiên Bản** | v1.0 |
| **Ngày Tạo** | 10 tháng 03 năm 2025 |
| **Cập Nhật Lần Cuối** | 10 tháng 03 năm 2025 |
| **Trạng Thái** | Draft |
| **Chủ Sở Hữu** | Product Manager |
| **Tài Liệu Liên Quan** | BRD-AIATP-2025-001, SRS-AIATP-2025-001, URD-AIATP-2025-001 |

---

## 1. MỤC ĐÍCH TÀI LIỆU

Tài liệu PRD (Product Requirements Document) này định nghĩa chi tiết **những gì** sản phẩm AIATP cần làm từ góc độ sản phẩm và trải nghiệm người dùng. PRD là cầu nối giữa BRD (yêu cầu nghiệp vụ cấp cao) và SRS (đặc tả kỹ thuật), cung cấp đủ ngữ cảnh để đội thiết kế và phát triển hiểu bức tranh toàn diện của từng tính năng.

---

## 2. TẦM NHÌN SẢN PHẨM

### 2.1 Tuyên Ngôn Sản Phẩm (Product Vision Statement)

> **Dành cho** các tổ chức phát triển phần mềm muốn tăng tốc độ phát hành và chất lượng sản phẩm, **AIATP là** một nền tảng kiểm thử thông minh sử dụng AI Agent, **giúp** tự động hóa toàn bộ vòng đời kiểm thử — từ phân tích đặc tả đến thực thi và báo cáo — **khác với** các công cụ automation test truyền thống cần lập trình thủ công. **AIATP** đọc hiểu tài liệu như một QA Engineer có kinh nghiệm, sinh ra test case thông minh, và tự phục hồi khi ứng dụng thay đổi.

### 2.2 Mục Tiêu Sản Phẩm

| Mục Tiêu | Chỉ Số Thành Công | Ưu Tiên |
|:---|:---|:---|
| Giảm thời gian chu kỳ kiểm thử | Từ 7–15 ngày xuống < 4 giờ | P0 |
| Tăng độ bao phủ kiểm thử | Đạt ≥ 85% requirement được cover | P0 |
| Giảm chi phí QA thủ công | Giảm ≥ 60% nhân lực thủ công | P0 |
| Phát hiện lỗi sớm (Shift-Left) | MTTD < 2 giờ sau mỗi commit | P1 |
| Self-healing khi UI thay đổi | Tỷ lệ tự phục hồi ≥ 80% | P1 |

---

## 3. PERSONA NGƯỜI DÙNG

### 3.1 Persona 1 — QA Engineer (Người dùng chính)

| Thuộc Tính | Mô Tả |
|:---|:---|
| **Tên** | Minh — QA Engineer cấp trung |
| **Kinh nghiệm** | 3–5 năm kiểm thử thủ công và automation cơ bản |
| **Công cụ quen dùng** | Jira, TestRail, Postman, Selenium |
| **Nỗi đau chính** | Viết test case tốn thời gian, maintain script khi UI thay đổi, thiếu thời gian cover edge case |
| **Mục tiêu** | Hoàn thành coverage cao hơn với ít công sức lặp lại hơn |
| **Kỳ vọng với AIATP** | AI sinh test case chính xác, mình chỉ cần review và approve; script không bị gãy sau mỗi sprint |

### 3.2 Persona 2 — QA Lead / Test Manager

| Thuộc Tính | Mô Tả |
|:---|:---|
| **Tên** | Hương — QA Lead |
| **Kinh nghiệm** | 7+ năm, quản lý đội 5–10 QA |
| **Nỗi đau chính** | Báo cáo tiến độ không realtime, khó đo lường coverage, nhân sự mất nhiều giờ vào tác vụ lặp lại |
| **Mục tiêu** | Tối ưu năng suất đội, báo cáo rõ ràng cho PO/PM, đảm bảo chất lượng release |
| **Kỳ vọng với AIATP** | Dashboard tổng quan theo dự án, bulk approve test case, nhận alert khi có lỗi nghiêm trọng |

### 3.3 Persona 3 — Developer

| Thuộc Tính | Mô Tả |
|:---|:---|
| **Tên** | Tuấn — Backend Developer |
| **Kinh nghiệm** | 4 năm, quen với CI/CD |
| **Nỗi đau chính** | Không biết code mình viết có break test nào không cho đến khi QA báo; bug phát hiện muộn |
| **Mục tiêu** | Nhận feedback testing tự động ngay sau mỗi PR |
| **Kỳ vọng với AIATP** | CI/CD integration, git comment tự động khi test fail, bảng kết quả test rõ ràng |

### 3.4 Persona 4 — Product Owner / BA

| Thuộc Tính | Mô Tả |
|:---|:---|
| **Tên** | Lan — Product Owner |
| **Kinh nghiệm** | Quản lý product, không chuyên kỹ thuật |
| **Nỗi đau chính** | Không biết feature đã được test đến đâu, thường xuyên lo lắng khi release |
| **Mục tiêu** | Yên tâm rằng mỗi requirement đã được kiểm thử trước khi release |
| **Kỳ vọng với AIATP** | Upload tài liệu BRD/PRD và nhận danh sách test scenario để duyệt; không cần hiểu kỹ thuật |

---

## 4. DANH SÁCH TÍNH NĂNG (FEATURE LIST)

### 4.1 Nhóm F1 — Quản Lý Dự Án & Đầu Vào

#### F1.1 — Quản Lý Dự Án (Project Management)

**Mô tả**: Màn hình chính cho phép người dùng tổ chức công việc kiểm thử theo dự án.

**User Stories**:
- US-01: Là một QA Lead, tôi muốn tạo Project mới để nhóm toàn bộ test suite và kết quả kiểm thử của một dự án phần mềm vào một chỗ.
- US-02: Là một Admin, tôi muốn phân quyền thành viên vào Project với các vai trò khác nhau (Owner, QA, Viewer) để kiểm soát ai được làm gì.
- US-03: Là một QA Engineer, tôi muốn xem danh sách tất cả dự án tôi có quyền truy cập để nhanh chóng chuyển đổi giữa các project.

**Acceptance Criteria**:
- [ ] Tạo project với tên, mô tả, và icon tùy chọn.
- [ ] Danh sách project hiển thị: tên, số test suite, trạng thái gần nhất, ngày cập nhật.
- [ ] Phân quyền RBAC: Owner > QA Lead > QA Engineer > Developer > Viewer.
- [ ] Tìm kiếm và lọc project theo tên, trạng thái.

---

#### F1.2 — Upload & Phân Tích Tài Liệu (Document Upload & Analysis)

**Mô tả**: Cho phép upload tài liệu đặc tả; AI tự động trích xuất requirements.

**User Stories**:
- US-04: Là một BA/PO, tôi muốn upload file BRD/PRD/SRS (PDF, DOCX, MD) để AI phân tích và trích xuất danh sách yêu cầu nghiệp vụ.
- US-05: Là một QA Lead, tôi muốn thấy trạng thái phân tích tài liệu realtime (đang phân tích, hoàn thành, lỗi) để biết khi nào có thể sinh test.
- US-06: Là một QA Engineer, tôi muốn xem danh sách requirements đã được AI trích xuất từ tài liệu để kiểm tra tính đúng đắn trước khi sinh test case.

**Acceptance Criteria**:
- [ ] Hỗ trợ định dạng: PDF, DOCX, MD, TXT, HTML.
- [ ] Giới hạn kích thước file: tối đa 50MB/file, 200 trang/file.
- [ ] Trạng thái phân tích được stream realtime qua SSE (Server-Sent Events).
- [ ] Kết quả phân tích hiển thị: Feature list, Business Rule list, Actor list, Data Entity list.
- [ ] Người dùng có thể xem và sửa requirements được trích xuất.

---

#### F1.3 — Kết Nối Môi Trường (Environment Management)

**Mô tả**: Quản lý các môi trường kiểm thử khác nhau (Dev, Staging, UAT, Production).

**User Stories**:
- US-07: Là một DevOps Engineer, tôi muốn cấu hình nhiều môi trường test với URL, credential, và biến môi trường riêng để chạy cùng bộ test trên các environment khác nhau.

**Acceptance Criteria**:
- [ ] CRUD environment với các trường: Tên, Base URL, Auth type (Basic/Bearer/API Key), Environment Variables.
- [ ] Credential được lưu trữ mã hóa, không hiển thị plaintext sau khi save.
- [ ] Cho phép chọn environment khi tạo test run.

---

### 4.2 Nhóm F2 — Sinh Test Case AI

#### F2.1 — Sinh Test Scenario (Test Scenario Generation)

**Mô tả**: AI phân tích requirements đã trích xuất và sinh danh sách test scenarios.

**User Stories**:
- US-08: Là một QA Engineer, tôi muốn nhấn một nút để AI tự động sinh danh sách test scenario từ requirements đã phân tích, giúp tôi tiết kiệm thời gian brainstorm.
- US-09: Là một QA Lead, tôi muốn xem toàn bộ test scenario được AI đề xuất, có đủ happy path, alternative path, negative path và edge case trước khi approve.

**Acceptance Criteria**:
- [ ] Mỗi scenario có: ID, Tên, Loại (happy/alternative/negative/edge), Mô tả, Mức độ rủi ro (Critical/High/Medium/Low), Requirement gốc liên kết.
- [ ] Bộ scenario cover ≥ 85% requirements đã phân tích.
- [ ] Người dùng có thể approve/reject từng scenario hoặc bulk approve.
- [ ] Tiến độ sinh scenario được stream realtime.

---

#### F2.2 — Sinh Test Case Chi Tiết (Test Case Generation)

**Mô tả**: Mỗi test scenario được AI mở rộng thành một hoặc nhiều test case chi tiết.

**User Stories**:
- US-10: Là một QA Engineer, tôi muốn AI sinh đầy đủ các bước thực hiện test với expected result rõ ràng cho từng test case, để tôi không cần viết thủ công từ đầu.
- US-11: Là một QA Engineer, tôi muốn AI tự động sinh test data (valid, invalid, boundary) kèm theo mỗi test case.

**Acceptance Criteria**:
- [ ] Mỗi test case có đủ 6 phần: Objective, Pre-condition, Test Steps (dạng bảng có Action/Expected Result cho từng bước), Post-condition, Test Data, Source Requirement.
- [ ] Test data được sinh theo 4 loại: Valid, Invalid, Boundary, Null/Empty.
- [ ] Test case có Confidence Score để đánh dấu những case AI không chắc chắn (< 0.6 = cần QA review kỹ).
- [ ] Test case được gán Risk Score và Priority dựa trên phân tích rủi ro.

---

#### F2.3 — Review & Phê Duyệt (Human-in-the-Loop Approval)

**Mô tả**: QA Engineer review, chỉnh sửa, và phê duyệt test case trước khi thực thi.

**User Stories**:
- US-12: Là một QA Engineer, tôi muốn xem, sửa nội dung, và approve/reject từng test case AI sinh ra để đảm bảo chất lượng trước khi thực thi.
- US-13: Là một QA Lead, tôi muốn bulk approve tất cả test case của một suite, hoặc lọc và approve theo nhóm (theo priority, theo feature) để tiết kiệm thời gian.

**Acceptance Criteria**:
- [ ] Bảng danh sách test case hỗ trợ: lọc theo Status (Pending/Approved/Rejected), Priority, Risk, Confidence.
- [ ] Click vào test case mở side panel hiển thị đầy đủ thông tin.
- [ ] Inline edit trực tiếp trên panel: sửa steps, test data, expected result.
- [ ] Bulk actions: chọn nhiều test case → Approve/Reject.
- [ ] LOW_CONFIDENCE badge (màu đỏ) tự động hiển thị cho test case có confidence < 0.6.

---

### 4.3 Nhóm F3 — Thực Thi Kiểm Thử

#### F3.1 — Tạo Và Quản Lý Test Run

**Mô tả**: Cho phép tổ chức và quản lý các lần chạy kiểm thử.

**User Stories**:
- US-14: Là một QA Lead, tôi muốn tạo Test Run từ tập hợp test case đã được approve, chọn môi trường, và kích hoạt thực thi tự động.
- US-15: Là một Developer, tôi muốn test run tự động kích hoạt khi tôi tạo Pull Request để nhận feedback ngay mà không cần chờ QA.

**Acceptance Criteria**:
- [ ] Tạo Test Run với: Tên, Test Suite, Environment, Chế độ (Manual Trigger / CI/CD).
- [ ] Trạng thái Test Run: Created → Queued → Running → Completed/Failed.
- [ ] Hỗ trợ parallel execution: tối thiểu 10 test case song song.
- [ ] API endpoint để CI/CD trigger test run.

---

#### F3.2 — Thực Thi UI Testing (Web)

**Mô tả**: Automation Agent thực thi test case trên web browser.

**User Stories**:
- US-16: Là một QA Engineer, tôi muốn xem test tự động được thực thi trên browser như một người dùng thật, có video recording, để tôi dễ debug khi có lỗi.

**Acceptance Criteria**:
- [ ] Hỗ trợ browser: Chrome, Firefox, Edge (Playwright-based).
- [ ] Thu thập sau mỗi test step: screenshot, DOM state.
- [ ] Thu thập cho mỗi failed test: full video, network log, console log.
- [ ] Timeout có thể cấu hình per-test-case.

---

#### F3.3 — Thực Thi API Testing

**Mô tả**: Automation Agent gọi và kiểm thử REST API endpoints.

**User Stories**:
- US-17: Là một QA Engineer, tôi muốn AI tự động gọi các API endpoint và kiểm tra response theo expected result đã định nghĩa trong test case.

**Acceptance Criteria**:
- [ ] Hỗ trợ HTTP methods: GET, POST, PUT, PATCH, DELETE.
- [ ] Hỗ trợ Authentication: Bearer Token, API Key, Basic Auth, OAuth2.
- [ ] Assertion types: Status code, Response body (JSON path), Response time, Schema validation.
- [ ] Hiển thị request/response đầy đủ cho từng test step.

---

#### F3.4 — Self-Healing khi UI Thay Đổi

**Mô tả**: Khi selector trong test script không còn tìm thấy element, AI tự tìm selector thay thế.

**User Stories**:
- US-18: Là một QA Engineer, tôi muốn test script tự động sửa selector bị lỗi khi UI thay đổi, thay vì toàn bộ test case fail và tôi phải sửa thủ công.

**Acceptance Criteria**:
- [ ] Self-healing chỉ kích hoạt khi lỗi là \`ElementNotFoundError\`, không kích hoạt cho assertion failure.
- [ ] Chiến lược healing theo thứ tự ưu tiên: Attribute fallback → visual proximity → semantic matching (LLM).
- [ ] Log rõ selector cũ và selector mới đã dùng để QA có thể review.
- [ ] Tỷ lệ self-healing thành công: ≥ 80% trường hợp UI thay đổi nhỏ.
- [ ] Chỉ kích hoạt khi \`self_healing_mode = ENABLED\` trong config của test run.

---

### 4.4 Nhóm F4 — Phát Hiện Lỗi & Báo Cáo

#### F4.1 — Phân Tích Lỗi Và Tạo Bug Ticket

**Mô tả**: Khi test fail, AI phân tích nguyên nhân và tự động tạo bug ticket.

**User Stories**:
- US-19: Là một QA Engineer, tôi muốn hệ thống tự động tạo bug ticket trên Jira với đầy đủ thông tin reproduce khi test case fail, để tôi không mất thêm 30 phút viết ticket thủ công.

**Acceptance Criteria**:
- [ ] Bug ticket có đầy đủ: Title, Steps to reproduce, Expected vs Actual, Severity, Priority, Screenshots, Video link.
- [ ] Severity được AI phân loại: Blocker / Critical / Major / Minor / Trivial.
- [ ] Cơ chế deduplication: không tạo ticket trùng nếu bug đã tồn tại.
- [ ] Tích hợp Jira với OAuth2, hỗ trợ cấu hình Project Key và Issue Type tùy chỉnh.

---

#### F4.2 — Dashboard Kết Quả Kiểm Thử

**Mô tả**: Màn hình tổng quan trực quan dành cho từng đối tượng người dùng.

**User Stories**:
- US-20: Là một QA Lead, tôi muốn nhìn vào dashboard và ngay lập tức biết trạng thái sức khỏe chất lượng của dự án: bao nhiêu test đang pass, coverage bao nhiêu, top 5 lỗi phổ biến nhất.
- US-21: Là một Product Owner, tôi muốn một trang overview đơn giản cho thấy mỗi requirement có được test chưa và kết quả ra sao.

**Acceptance Criteria**:
- [ ] Dashboard chính hiển thị: Total test cases, Pass/Fail/Skip rate, Coverage %, Trend chart (7 ngày gần nhất), Top 5 failing tests.
- [ ] Lọc theo project, suite, environment, date range.
- [ ] Dashboard load trong < 3 giây với 10.000 test records.
- [ ] Requirement Traceability View: Liên kết requirement → test case → kết quả.

---

#### F4.3 — Báo Cáo Kiểm Thử (Test Report)

**Mô tả**: Sinh báo cáo kiểm thử sau mỗi test run theo nhiều định dạng.

**User Stories**:
- US-22: Là một QA Lead, tôi muốn nhấn một nút để xuất báo cáo kiểm thử dạng PDF gửi cho khách hàng sau mỗi sprint.

**Acceptance Criteria**:
- [ ] Xuất báo cáo các định dạng: PDF, HTML (interactive), JUnit XML.
- [ ] Nội dung báo cáo: Executive Summary, Test Results Table, Pass/Fail breakdown, Bug List, Coverage Chart, Khuyến nghị.
- [ ] Báo cáo được sinh tự động ngay sau khi test run hoàn thành.
- [ ] Lưu trữ lịch sử báo cáo các run trước.

---

### 4.5 Nhóm F5 — Tích Hợp & CI/CD

#### F5.1 — CI/CD Pipeline Integration

**Mô tả**: Tích hợp AIATP vào quy trình CI/CD hiện có của tổ chức.

**User Stories**:
- US-23: Là một DevOps Engineer, tôi muốn cấu hình GitHub Actions để tự động trigger test run mỗi khi có pull request merged vào branch main.

**Acceptance Criteria**:
- [ ] Cung cấp official GitHub Actions workflow, GitLab CI template, Jenkins plugin.
- [ ] Tích hợp qua REST API: \`POST /api/v1/test-runs\` để trigger, \`GET /api/v1/test-runs/{id}\` để poll kết quả.
- [ ] Quality Gate: có thể cấu hình fail CI build nếu pass rate < ngưỡng hoặc có lỗi Critical.
- [ ] Kết quả test hiển thị trong CI/CD pipeline UI (GitHub PR comment, GitLab MR widget).

---

## 5. INFORMATION ARCHITECTURE & USER FLOWS

### 5.1 Cấu Trúc Điều Hướng Chính

\`\`\`
AIATP Dashboard
├── Projects
│   └── [Project Name]
│       ├── Documents       ← Upload & xem kết quả phân tích tài liệu
│       ├── Test Suites     ← Danh sách suite, trigger generate AI
│       │   └── [Suite Name]
│       │       ├── Test Cases     ← Review/approve từng test case
│       │       └── Generation Progress (SSE stream)
│       ├── Test Runs       ← Lịch sử và kết quả thực thi
│       │   └── [Run Name]
│       │       └── Test Results   ← Chi tiết từng test case
│       ├── Environments    ← Cấu hình env
│       └── Reports         ← Báo cáo xuất PDF/HTML
├── Bug Tracker (Jira Integration)  
└── Settings
    ├── Team & Permissions
    ├── CI/CD Integration
    └── AI Model Configuration
\`\`\`

### 5.2 Luồng Chính — Sinh Test Case Từ Tài Liệu

\`\`\`
1. Upload BRD/SRS/PRD
        ↓
2. AI Analysis (Document Agent) → Realtime SSE progress
        ↓
3. QA xem Requirements được trích xuất → Confirm
        ↓
4. Nhấn "Generate AI Test Cases"
        ↓
5. AI sinh Scenarios + Cases (TGA Agent) → Realtime SSE progress
        ↓
6. QA Review → Approve/Reject/Edit Test Cases
        ↓
7. Tạo Test Run → Chọn Environment → Execute
        ↓
8. Xem kết quả Dashboard + Tự động tạo Bug Ticket (nếu fail)
\`\`\`

---

## 6. UX/UI REQUIREMENTS

### 6.1 Nguyên Tắc Thiết Kế

| Nguyên Tắc | Mô Tả |
|:---|:---|
| **Clarity First** | Trạng thái hệ thống luôn rõ ràng — người dùng biết hệ thống đang làm gì tại mọi thời điểm |
| **Progressive Disclosure** | Hiển thị thông tin cơ bản trước, chi tiết kỹ thuật khi người dùng cần |
| **AI Transparency** | Luôn hiển thị Confidence Score và nguồn requirement gốc của mọi test case AI sinh ra |
| **Minimal Friction** | Luồng review/approve phải operationalize nhanh nhất có thể |

### 6.2 Yêu Cầu Giao Diện Cụ Thể

| Thành Phần | Yêu Cầu |
|:---|:---|
| **Progress Indicators** | Mọi tác vụ AI dài (> 3 giây) phải có thanh tiến độ với % và message mô tả bước đang làm |
| **Status Badges** | Nhất quán: 🟢 xanh lá = COMPLETED/APPROVED; 🔵 xanh lam nhấp nháy = IN_PROGRESS; 🔴 đỏ = FAILED/REJECTED; ⚪ xám = PENDING |
| **Confidence Badge** | Test case có confidence < 0.6 phải có badge đỏ "LOW CONFIDENCE" dễ nhận biết |
| **Risk Color Coding** | CRITICAL = đỏ nền; HIGH = cam; MEDIUM = vàng; LOW = xanh lá |
| **Realtime Updates** | Trạng thái thay đổi không yêu cầu refresh trang — sử dụng SSE hoặc WebSocket |
| **Responsive** | Hỗ trợ desktop (1280px+); tablet không yêu cầu trong v1.0 |

---

## 7. API REQUIREMENTS

### 7.1 Các API Endpoint Cốt Lõi

| Method | Path | Mô Tả | Auth |
|:---|:---|:---|:---|
| \`GET\` | \`/api/v1/projects\` | Danh sách projects của user | JWT |
| \`POST\` | \`/api/v1/projects\` | Tạo project mới | JWT |
| \`POST\` | \`/documents\` | Upload tài liệu | JWT |
| \`GET\` | \`/documents/{id}/status\` | SSE stream trạng thái phân tích | JWT |
| \`GET\` | \`/api/v1/test-suites\` | Danh sách test suites theo project | JWT |
| \`POST\` | \`/api/v1/test-suites\` | Tạo test suite | JWT |
| \`POST\` | \`/api/v1/test-suites/{id}/generate\` | Trigger AI sinh test case | JWT |
| \`GET\` | \`/api/v1/test-suites/{id}/generation-status\` | SSE stream tiến độ AI | JWT |
| \`GET\` | \`/api/v1/test-cases\` | Danh sách test case (paging, filter) | JWT |
| \`PUT\` | \`/api/v1/test-cases/{id}\` | Cập nhật test case (sửa, approve, reject) | JWT |
| \`POST\` | \`/api/v1/test-runs\` | Tạo và trigger test run | JWT |
| \`GET\` | \`/api/v1/test-runs/{id}\` | Chi tiết test run + kết quả | JWT |

### 7.2 Chuẩn Response

- Tất cả response trả JSON.
- Error response có format chuẩn: \`{ "error_code": "...", "message": "...", "detail": "..." }\`.
- Pagination dùng \`page\` + \`limit\` query param; response có \`total\`, \`page\`, \`limit\`.
- SSE events có \`event: status_update\` with \`data: { status, progress_percent, message }\`.

---

## 8. NON-FUNCTIONAL REQUIREMENTS

| Loại | Yêu Cầu | Chỉ Số |
|:---|:---|:---|
| **Performance** | API phản hồi nhanh | < 2 giây (p95) ở tải bình thường |
| **Performance** | Phân tích tài liệu 50 trang | < 15 phút |
| **Performance** | Sinh test case cho 1 module 20 tính năng | < 30 phút |
| **Scalability** | Concurrent test executions | ≥ 50 concurrent test runs |
| **Availability** | Uptime hệ thống | ≥ 99.5%/tháng |
| **Security** | Truyền tải dữ liệu | TLS 1.3; dữ liệu lưu trữ AES-256 |
| **Security** | Xác thực | JWT + tùy chọn MFA cho Admin |
| **Browser Support** | Tương thích | Chrome 100+, Firefox 100+, Edge 100+, Safari 15+ |

---

## 9. PHÂN TÍCH PHỤ THUỘC VÀ RỦI RO SẢN PHẨM

### 9.1 Phụ Thuộc Sản Phẩm

| Phụ Thuộc | Mức Tác Động | Kế Hoạch Dự Phòng |
|:---|:---|:---|
| Gemini API (LLM) | Rất Cao | LLM abstraction layer hỗ trợ đa provider; cache response khi có thể |
| Chất lượng tài liệu đầu vào | Cao | Template hướng dẫn viết tài liệu; hỗ trợ fallback phân tích source code |
| Playwright / Browser ổn định | Trung Bình | Retry mechanism; headless + headed mode |

### 9.2 Rủi Ro Sản Phẩm Chính

| Rủi Ro | Xác Suất | Tác Động | Mitigration |
|:---|:---|:---|:---|
| Test case AI không sát yêu cầu | Trung Bình | Cao | Bắt buộc human review trước khi execute; KPI đo accuracy hàng tuần |
| Người dùng không tin tưởng AI suggestion | Cao | Trung Bình | Hiển thị Confidence Score, Source Requirement rõ ràng; feedback loop cải thiện |
| Self-healing false positive (heal sai) | Thấp | Cao | Log chi tiết để QA review; chỉ lưu selector mới sau khi QA xác nhận |

---

## 10. LỘ TRÌNH SẢN PHẨM (PRODUCT ROADMAP)

### Phase 1 — Foundation (M1–M2): Đã Triển Khai ✅
- [x] Project Management UI (tạo project, upload document)
- [x] Document Analysis AI Agent (DAA)
- [x] Requirement extraction và hiển thị
- [x] System foundation: FastAPI backend, Next.js frontend, Kafka, PostgreSQL

### Phase 2 — AI Test Generation (M3): Đang Triển Khai 🔄
- [x] Test Generation Agent (TGA) — LangGraph workflow
- [x] Kafka Consumer cho TGA
- [x] SSE realtime progress stream
- [x] Test Suites Management UI (D1)
- [ ] Test Cases Review & Approval UI (D2, D3, D4)

### Phase 3 — Execution Engine (M4): Kế Hoạch 📋
- [ ] AI Execution Agent (Playwright-based)
- [ ] API Testing Agent
- [ ] Self-Healing Agent
- [ ] Test Run Management UI & Reports

### Phase 4 — Integration & Polish (M5): Kế Hoạch 📋
- [ ] CI/CD Integration (GitHub Actions, GitLab CI)
- [ ] Jira Bug Ticket Integration
- [ ] Advanced Dashboard & Analytics
- [ ] Performance optimization & scale testing

---

## 11. METRICS ĐO LƯỜNG

| Metric | Cách Đo | Mục Tiêu 3 Tháng | Mục Tiêu 6 Tháng |
|:---|:---|:---|:---|
| AI Test Case Accuracy | QA review sample ngẫu nhiên | ≥ 75% | ≥ 85% |
| Thời gian sinh test case | End-to-end từ upload đến approve-ready | < 45 phút | < 30 phút |
| Tỷ lệ test case được approve không sửa | Số approved / total | ≥ 60% | ≥ 75% |
| User Satisfaction Score | Khảo sát sau mỗi sprint | NPS ≥ 30 | NPS ≥ 50 |
| Time saved per QA Engineer | Ước lượng giờ/sprint | ≥ 4 giờ | ≥ 8 giờ |

---

## 12. BẢNG THUẬT NGỮ

| Thuật Ngữ | Định Nghĩa |
|:---|:---|
| **Agent** | Chương trình AI tự chủ thực hiện một nhiệm vụ cụ thể trong pipeline AIATP |
| **Test Scenario** | Kịch bản kiểm thử mô tả một luồng sử dụng (happy/alternative/negative/edge) |
| **Test Case** | Tập hợp đầy đủ các bước, điều kiện và kết quả mong đợi để thực thi một scenario |
| **Test Suite** | Tập hợp các test case liên quan được nhóm lại theo tính năng hoặc module |
| **Test Run** | Một lần thực thi tập hợp test cases trên một môi trường cụ thể |
| **SSE** | Server-Sent Events — cơ chế server đẩy updates realtime về cho browser |
| **Self-Healing** | Khả năng tự sửa test script khi UI element thay đổi |
| **Confidence Score** | Điểm tin cậy (0–1) AI đánh giá độ chính xác của test case được sinh ra |
| **Risk Score** | Điểm rủi ro (0–1) phản ánh tác động nghiệp vụ nếu tính năng này lỗi |
| **LangGraph** | Framework xây dựng AI workflow dạng graph dùng để điều phối các node AI Agent |
| **Kafka** | Message broker dùng để truyền sự kiện bất đồng bộ giữa các Agent |
| **TGA** | Test Generation Agent — AI Agent chịu trách nhiệm sinh test scenario và test case |
| **DAA** | Document Analysis Agent — AI Agent phân tích và trích xuất yêu cầu từ tài liệu |
`;

  await page.getByRole('dialog', { name: 'Tạo Feature mới' }).getByRole('textbox').fill(prdContent);
  await page.getByRole('button', { name: 'Create Feature' }).click();

  // Chờ 3 phút để AI sinh test
  console.log('Đang chờ 7 phút để AI sinh test...');
  await page.waitForTimeout(7 * 60 * 1000);

  // Đợi button "Duyệt" có thể click
  const btn = page.getByRole('button', { name: 'Duyệt' });
  await expect(btn).toBeEnabled();
  await btn.click();
  console.log('Đã nhấn Duyệt lần 1.');

  // Chờ tiếp 7 phút
  console.log('Tiếp tục chờ 7 phút...');
  await page.waitForTimeout(7 * 60 * 1000);
  await expect(btn).toBeEnabled();
  await btn.click();
  console.log('Đã nhấn Duyệt lần 2. Hoàn thành luồng.');
});