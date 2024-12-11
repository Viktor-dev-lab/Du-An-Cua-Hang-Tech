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
        res.redirect("back");  // Redirect lại trang cũ
    } else {
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
    
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

}

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const account = await Account.findOne({_id: id},{deleted:false});
    const role = await Role.find({deleted:false});

    res.render("admin/pages/account/edit.pug", {
        pageTitle: "Chỉnh Sửa Tài Khoản",
        account: account,
        roles: role
    })
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const EmailExist = await Account.findOne({
        _id: {$ne:id}, // tìm các id loại trừ id hiện tại != id
        email: req.body.email,
        deleted: false
    });

    if (EmailExist) {
        req.flash("error", "Email đã tồn tại");
    } else {
        if (req.body.password){
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        await Account.updateOne({_id:id},req.body);
        req.flash("success","Cập nhật tài khoản thành công");
    }
    res.redirect("back");
}