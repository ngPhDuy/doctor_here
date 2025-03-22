const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "phuongduyk21@gmail.com", // Địa chỉ email của bạn
    pass: "ienjrlahycjpbkga", // Mật khẩu ứng dụng (không phải mật khẩu tài khoản chính)
  },
});

exports.sendEmail = async function (recipientEmail, username, password) {
  const mailOptions = {
    from: "phuongduyk21@gmail.com",
    to: recipientEmail, // Địa chỉ email nhận
    subject: `Mật khẩu đăng nhập mới cho tài khoản ${username}`,
    text: `Chào bác sĩ, \n\nMật khẩu đăng nhập của bạn là: ${password}\n\nVui lòng sử dụng mật khẩu này để đăng nhập.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công!");
  } catch (error) {
    console.log("Lỗi khi gửi email: ", error);
  }
};
