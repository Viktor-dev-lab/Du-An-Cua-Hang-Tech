// import
const md5 = require('md5');

//model
const Account = require("../../models/account.model.js");
const Role = require("../../models/roles.model.js");

// prefix address
const systemConfig = require('../../config/system.js');

// [GET] admin/accounts
module.exports.index = async (req, res) => {
    
    let find = {
        deleted: false,
    }
    const account = await Account.find(find).select("-password -token");
    for (const record of account){
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    res.render("admin/pages/account/index.pug", {
        pageTitle: "Danh Sách Tài Khoản",
        accounts: account
    })
}

// [GET] admin/accounts/create
module.exports.create = async (req, res) => {
    const role = await Role.find({deleted:false});

    res.render("admin/pages/account/create.pug", {
        pageTitle: "Danh Sách Tài Khoản",
        roles: role
    })
}

module.exports.createPost = async (req, res) => {
    const EmailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if (EmailExist) {
        req.flash("error", "Email đã tồn tại");
        req.flash("formData", req.body);  // Lưu trữ dữ liệu form vào flash
        return res.redirect("back");  // Redirect lại trang cũ
    }

    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}
