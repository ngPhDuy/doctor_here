# Doctor Here

**Doctor Here** là một hệ thống chăm sóc sức khỏe trực tuyến, hỗ trợ đặt lịch khám, tư vấn từ xa (chat/video call), theo dõi sức khỏe và đưa ra cảnh báo sớm dựa trên AI.

---

## **Tính năng chính**

### 1. Dành cho người dùng

- Tìm kiếm và đặt lịch khám với bác sĩ
- Nhắn tin và gọi video 1-1 với bác sĩ
- Theo dõi kết quả khám, đơn thuốc và nhắc uống thuốc
- Theo dõi các chỉ số sức khỏe (nhịp tim, nhịp thở, BMI, số bước, v.v.)
- Dự đoán nguy cơ tiểu đường bằng mô hình AI

### 2. Dành cho bác sĩ

- Quản lý lịch khám và cuộc hẹn
- Trao đổi với bệnh nhân qua chat và video
- Gửi kết quả khám và đơn thuốc
- Điều chỉnh quyền truy cập kết quả khám bệnh

### 3. Dành cho quản trị viên

- Duyệt yêu cầu cập nhật thông tin của bác sĩ
- Quản lý toàn bộ người dùng, bác sĩ, thông tin các loại thuốc

---

## **Công nghệ sử dụng**

- **Backend:** NodeJS, ExpressJS, PostgreSQL, Swagger
- **AI Service:** Python (FastAPI) + mô hình ML dự đoán (LightGBM)
- **Frontend:** React (Web), React Native (Mobile)
- **DevOps:** Docker, docker-compose, Nginx, VPS

---

## **Cấu trúc thư mục**

- `server/`: Backend API (NodeJS + ExpressJS)
- `ai_service/`: AI Service
- `production/`: File cấu hình Docker, nginx, môi trường production
- `README.md`: Tài liệu hướng dẫn sử dụng

---

## **Triển khai hệ thống**

### Yêu cầu

- Đã cài đặt Docker và Docker Compose
- Đã cấu hình `.env` phù hợp cho các service (backend, AI, nginx…)

### Các bước triển khai

1. Build mã nguồn ở thư mục client:

```bash
cd client
npm install
npm run build
```

2. Truy cập thư mục production chứa file cấu hình Docker:

```bash
cd ../production
```

3. Khởi chạy:

```bash
docker compose -p doctor-here up -d
```

### Sau khi triển khai

- Các container chính bao gồm:

  - backend: sử dụng cổng 8080
  - nginx: sử dụng cổng 80
  - ai_service: sử dụng cổng 8000

- Để ngừng hệ thống, thực thi lệnh:

```bash
docker compose -p doctor-here down
```
