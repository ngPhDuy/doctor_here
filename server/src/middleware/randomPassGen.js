function generateRandomPassword(length = 5) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Các ký tự có thể có trong mật khẩu
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length); // Chọn một chỉ số ngẫu nhiên
    password += characters[randomIndex]; // Thêm ký tự vào mật khẩu
  }

  return password;
}

// Xuất hàm ra để có thể sử dụng trong các tệp khác
module.exports = { generateRandomPassword };
