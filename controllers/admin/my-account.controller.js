// import
const md5 = require('md5');

//model
const Account = require("../../models/account.model.js");

// prefix address
const systemConfig = require('../../config/system.js');


// [GET] admin/my-account
module.exports.index = async (req, res) => {

    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Tài Khoản",
    })
}

// [GET] admin/my-account/edit
module.exports.edit = async (req, res) => {

    res.render("admin/pages/my-account/edit.pug", {
        pageTitle: "Sửa Tài Khoản",
    })
}

// [PATCH] admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
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