// Models
const User = require("../../models/user.model.js");
const Product = require("../../models/product.model.js");

// Helpers
const productsHelper = require('../../helpers/product.js');

// Import
const md5 = require("md5")

// [GET] /register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng Kí Tài Khoản",
    })
}

// [POST] /register
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