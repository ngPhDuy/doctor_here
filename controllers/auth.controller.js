const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const account = await authService.login(username, password);
        req.session.user = {
            username: account.ten_dang_nhap
        };
        res.status(200).json({ message: 'Đăng nhập thành công!', user: req.session.user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Không thể đăng xuất!' });
        }
        res.status(200).json({ message: 'Đăng xuất thành công!' });
    });
};
