const {Account} = require('../models');

exports.login = async (username, password) => {
    const account = await Account.findOne({
        where: { ten_dang_nhap: `${username}`},
    });
    
    if (!account) {
        throw new Error('Tài khoản không tồn tại');
    }

    if (account.mat_khau !== password) {
        throw new Error('Mật khẩu không đúng');
    }

    return account;
};