# 🛡️ MARS-MES — Hệ thống Điều hành Nhà máy Sửa chữa Ô tô Quân sự

> **Military Auto Repair Shop – Manufacturing Execution System**
> Frontend SPA: **ReactJS + Vite + TailwindCSS + Lucide Icons**

## ✨ Tính năng chính

| # | Phân hệ | Mô tả |
|---|---------|-------|
| 1 | **Dashboard điều hành** | 8 KPI thời gian thực, biểu đồ cột theo Ngày/Tuần/Tháng, donut chất lượng, cảnh báo vật tư |
| 2 | **Quản lý Phương tiện** | Bảng hồ sơ + QR mock canvas, lọc theo QR, popup hồ sơ sửa chữa điện tử, CRUD đầy đủ |
| 3 | **Quản lý Động cơ** | Danh sách động cơ tháo rã phục hồi, liên kết phương tiện, CRUD |
| 4 | **Kế hoạch sửa chữa** | Chuyển đổi Ngày/Tuần/Tháng, 5 mức trạng thái màu, lọc, thống kê, CRUD |
| 5 | **Công đoạn công nghệ** | Pipeline 9 bước bắt buộc (Tiếp nhận → Nghiệm thu), cảnh báo tự động, chi tiết tiến độ |
| 6 | **KCS điện tử** | Form đo kiểm 7 thông số (khe hở, độ côn, ôvan, áp suất, nhiệt độ, nhám, kích thước), tự động so sánh tiêu chuẩn, sinh phiếu KCS in được |
| 7 | **Vật tư – Phụ tùng** | Danh mục + nhật ký nhập/xuất kho, cảnh báo dưới mức tối thiểu |
| 8 | **Báo cáo & Quản trị** | Lọc Ngày/Tuần/Tháng/Quý, xuất Excel/PDF mock, tài khoản, nhật ký, sao lưu/khôi phục dữ liệu |

## 🔐 Phân quyền (mock)

- **Lãnh đạo / Chỉ huy** – Chỉ xem
- **Kỹ thuật** – Cập nhật kế hoạch, tiến độ
- **KCS** – Nhập đo kiểm, duyệt/khóa công đoạn
- **Vật tư** – Nhập xuất kho
- **Admin** – Toàn quyền

Chuyển vai trò ngay tại **góc phải Header** (click avatar).

## 🎨 Phong cách "Military Digital Factory"

- Màu chính: **Xanh lục quân đội** (`#1e3a1e` → `#2d4a22`)
- Điểm nhấn: **Xanh Cyan** (`#06b6d4`) / **Tech Blue** (`#3b82f6`)
- Font: **Inter** + **JetBrains Mono** cho dữ liệu kỹ thuật
- Icon: **Lucide React**

## 🚀 Cài đặt & chạy

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev   # → http://localhost:5173

# Build production
npm run build

# Xem thử bản build
npm run preview
```

Mở lên là có ngay dữ liệu mẫu (mock data) hiển thị đầy đủ ở tất cả 8 phân hệ.

## 🗂️ Cấu trúc thư mục

```
V2/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css                  ← Tailwind + custom components
    ├── data/
    │   └── mockData.js            ← 9 công đoạn, 5 vai trò, tiêu chuẩn KCS, seed DB
    └── components/
        ├── Layout.jsx             ← Sidebar + Header + Role switcher
        ├── common/
        │   └── UI.jsx             ← Modal, Section, QRCanvas, StatusPill, Confirm
        └── modules/
            ├── Dashboard.jsx
            ├── VehicleManager.jsx
            ├── EngineManager.jsx
            ├── PlanManager.jsx
            ├── ProcessManager.jsx
            ├── KCS.jsx
            ├── Inventory.jsx
            └── Reports.jsx        ← Reports + Admin
```

## 💾 Dữ liệu

- Mọi dữ liệu lưu tại `localStorage` với key `mars_mes_db_v1`
- Tự động seed lần đầu (mở app là có data)
- Có thể **Reset dữ liệu mẫu** tại `Quản trị hệ thống → Dữ liệu`
- Có thể **Tải file backup JSON** ở cùng trang

## 📌 Ghi chú

- Đây là **bản Frontend mockup** – chưa có backend thật, AI dự báo đã được loại bỏ theo yêu cầu.
- QR Code sinh bằng canvas (giả lập trực quan, không cần thư viện ngoài).
- Xuất Excel/PDF hiển thị thông báo alert (mockup) – có thể tích hợp `xlsx` / `jspdf` thật khi cần.

---
© 2026 · Bộ Quốc phòng · Digital Factory v1.0
