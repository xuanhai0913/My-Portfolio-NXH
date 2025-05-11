# My Portfolio

Đây là dự án portfolio cá nhân được xây dựng bằng React.

## Cấu trúc dự án

```
src/
  ├── assets/         # Lưu trữ các tài nguyên tĩnh
  │   ├── images/     # Hình ảnh 
  │   └── styles/     # Global styles
  │
  ├── components/     # Các component dùng chung, tái sử dụng
  │   ├── ui/         # Các component UI cơ bản (button, input, etc.)
  │   └── common/     # Các component dùng chung
  │
  ├── hooks/          # Custom hooks
  │
  ├── layouts/        # Các layout component (Header, Footer, etc.)
  │
  ├── pages/          # Components tương ứng với từng trang
  │   ├── Home/
  │   ├── About/
  │   ├── Portfolio/
  │   └── Contact/
  │
  ├── services/       # API calls và services
  │
  ├── utils/          # Các hàm tiện ích
  │
  ├── context/        # React Context Providers
  │
  ├── config/         # Cấu hình ứng dụng
  │
  ├── App.jsx
  └── index.js
```

## Các đặc điểm

- Sử dụng React Hooks và Functional Components
- Lazy loading cho các component không quan trọng
- Error Boundary để xử lý lỗi
- Tối ưu hóa hiệu suất với Code Splitting và Suspense
- Analytics và Speed Insights từ Vercel

## Hướng dẫn cài đặt

```bash
# Clone dự án
git clone https://github.com/yourusername/My-Portfolio.git

# Di chuyển vào thư mục dự án
cd My-Portfolio

# Cài đặt dependencies
npm install

# Chạy dự án
npm start
```

## Triển khai

Dự án được triển khai trên Vercel.
