const {Account} = require('../models');

exports.changePassword = async (username, password, newPassword) => {
    const account = await Account.findOne({
        where: {
            ten_dang_nhap: username,
            mat_khau: password,
        },
    });
    if (!account) {
        return false;
    }
    account.mat_khau = newPassword;
    await account.save();
    return true;
}