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

exports.toggleActive = async (username) => {
    const account = await Account.findOne({
        where: {
            ten_dang_nhap: username,
        },
    });
    if (!account) {
        return false;
    }
    account.active = !account.active;
    await account.save();
    return {
        result: true,
        new_active: account.active,
    }
}