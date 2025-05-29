# Dockerfile cho Backend
FROM node:20-alpine

WORKDIR /doctor_here/server

# Cài đặt các phụ thuộc
COPY package*.json ./
RUN npm install

RUN npm install -g @babel/core @babel/cli

# Sao chép mã nguồn vào container
COPY . .

RUN npm run build-src

# Mở cổng mà backend sẽ chạy
# EXPOSE 8080

# Chạy ứng dụng
CMD ["npm", "run", "build"]

#docker build -t doctor_here_server .
#docker run -p 8080:8080 doctor_here_server