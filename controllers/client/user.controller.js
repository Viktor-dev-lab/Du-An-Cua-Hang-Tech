// Models
const User = require("../../models/user.model.js");
const Product = require("../../models/product.model.js");

// Helpers
const productsHelper = require('../../helpers/product.js');

// Import
const md5 = require("md5")

// [GET]  /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng Kí Tài Khoản",
    })
}

// [POST]  /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({ email: req.body.email, deleted: false});

    if (existEmail){
        req.flash("error", "Email đã tồn tại !");
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password)
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

// [GET]  /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng Nhập Tài Khoản",
    })
}

// [POST]  /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email, deleted: false});
    if (!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password){
        req.flash("error", "Mật khẩu không đúng");
        res.redirect("back");
        return;
    }

    if (user.status != "active"){
        req.flash("error", "Tài khoản đang bị khóa");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

// [GET]  /user/passowrd/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Lấy lại mật khẩu",
    })
}