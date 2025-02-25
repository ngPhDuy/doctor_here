const {Account} = require('../models');
const bcrypt = require('bcrypt');

exports.changePassword = async (username, password, newPassword) => {
    const account = await Account.findOne({
        where: {
            ten_dang_nhap: username,
        },
    });
    if (!account) {
        return false;
    }
    const match = await bcrypt.compare(password, account.mat_khau);
    if (!match) {
        return false;
    }
    newPassword = await bcrypt.hash(newPassword, 10);
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

exports.changePasswordFromAdmin = async (username, newPassword) => {
    const account = await Account.findOne({
        where: {
            ten_dang_nhap: username,
        },
    });
    if (!account) {
        return false;
    }
    newPassword = await bcrypt.hash(newPassword, 10);
    account.mat_khau = newPassword;
    await account.save();
    return true;
}