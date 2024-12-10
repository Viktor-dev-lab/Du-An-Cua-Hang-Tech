//model
const Account = require("../../models/account.model.js");

// prefix address
const systemConfig = require('../../config/system.js');

// [GET] admin/accounts
module.exports.index = async (req, res) => {
    
    let find = {
        deleted: false,
    }
    const account = await Account.find(find);
    res.render("admin/pages/account/index.pug", {
        pageTitle: "Danh Sách Tài Khoản",
        accounts: account
    })
}

// [GET] admin/accounts/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/account/create.pug", {
        pageTitle: "Danh Sách Tài Khoản",
    })
}

// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
    const record = new Account(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}