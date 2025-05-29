# Dockerfile cho Frontend (React + Vite)
FROM node:20-alpine AS builder

WORKDIR /doctor_here/client

# Cài đặt các phụ thuộc
COPY package*.json ./
RUN npm install

# Sao chép mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Bước 2: Dùng Nginx để serve các file tĩnh
FROM nginx:alpine

# Sao chép file đã build từ bước trước vào thư mục của Nginx
COPY --from=builder /doctor_here/client/dist /usr/share/nginx/html

# Sao chép file cấu hình Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# # Mở cổng 80
# EXPOSE 80

# # Chạy Nginx
# CMD ["nginx", "-g", "daemon off;"]
