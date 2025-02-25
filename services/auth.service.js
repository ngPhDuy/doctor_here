const {Account} = require('../models');
const bcrypt = require('bcrypt');

exports.login = async (username, password) => {
    const account = await Account.findOne({
        where: { ten_dang_nhap: `${username}`},
    });
    
    if (!account) {
        throw new Error('Tài khoản không tồn tại');
    }

    const match = await bcrypt.compare(password, account.mat_khau);
    if (!match) {
        throw new Error('Sai mật khẩu');
    }

    if (account.active === false) {
        throw new Error('Tài khoản đã bị khóa');
    }

    return account;
};