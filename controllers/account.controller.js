const accountService = require('../services/account.service');

exports.changePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    console.log(username, oldPassword, newPassword);
    let result = await accountService.changePassword(username, oldPassword, newPassword);
    if (result) {
        res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
    } else {
        res.status(400).json({ message: 'Đổi mật khẩu thất bại!' });
    }
}