# **Hướng dẫn cài đặt dự án React + TypeScript với Vite và Tailwind CSS**

## **1. Tạo dự án React + TypeScript bằng Vite**

Chạy lệnh sau để khởi tạo dự án mới:

```bash
npm create vite@latest my-app -- --template react-ts
```

Di chuyển vào thư mục dự án:

```bash
cd my-app
```

Cài đặt các dependencies:

```bash
npm install
```

Chạy dự án:

```bash
npm run dev
```

Dự án sẽ chạy tại địa chỉ [http://localhost:5173](http://localhost:5173).

---

## **2. Cài đặt Tailwind CSS**

Cài đặt Tailwind CSS và các công cụ cần thiết:

```bash
npm install tailwindcss postcss autoprefixer
```

Khởi tạo file cấu hình Tailwind:

```bash
npx tailwindcss init -p
```

---

## **3. Cấu hình Tailwind CSS**

Mở file `tailwind.config.js` và cập nhật nội dung:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## **4. Thêm Tailwind vào dự án**

Mở file `src/index.css` (hoặc tạo mới nếu chưa có) và thêm các dòng sau:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import file CSS vào dự án trong `src/main.tsx`:

```tsx
import "./index.css";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello Tailwind CSS with Vite!
      </h1>
    </div>
  );
}

export default App;
```

---

## **5. Chạy lại dự án**

Sau khi thiết lập Tailwind, chạy dự án bằng lệnh:

```bash
npm run dev
```

Kiểm tra ứng dụng tại [http://localhost:5173](http://localhost:5173).

---

## **6. Build dự án cho production**

Khi hoàn tất phát triển, build dự án bằng lệnh:

```bash
npm run build
```

Dữ liệu sẽ được tạo trong thư mục `dist`.

---

## **7. Xử lý lỗi phổ biến**

Nếu gặp lỗi, thử các bước sau:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

Chúc bạn cài đặt thành công dự án React + TypeScript với Tailwind CSS!
