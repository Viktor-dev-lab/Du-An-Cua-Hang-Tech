// Models
const User = require("../../models/user.model.js");
const ForgotPassword = require("../../models/forgot-password.model.js");
const RegisterOtp = require("../../models/register-otp.model.js");
const Cart = require("../../models/cart.model.js");

// Helpers
const generateHelper = require('../../helpers/generate.js');
const sendMailHelper = require('../../helpers/sendMail.js');

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
    const email = req.body.email;
    const password = md5(req.body.password);
    const fullName = req.body.fullName;

    const existEmail = await User.findOne({
        email: email,
        deleted: false
    });

    if (existEmail) {
        req.flash("error", "Email đã tồn tại !");
        res.redirect("back");
        return;
    }

    const otp = generateHelper.generateOTP(8);
    const objectRegisterOtp = {
        fullName: fullName,
        email: email,
        password: password,
        otp: otp,
        expireAt: Date.now()
    }

    const registerOtp = new RegisterOtp(objectRegisterOtp);
    await registerOtp.save();

    // Send Email 
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Mã OTP Xác Minh</title>
     </head>
     <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
         <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
             <header style="background-color: #4CAF50; color: #fff; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                 Mã OTP Xác Minh
             </header>
             <main style="padding: 20px;">
                 <p>Xin chào,</p>
                 <p>Bạn đã yêu cầu lấy đăng kí cho tài khoản của mình. Vui lòng sử dụng mã OTP dưới đây để xác minh:</p>
                 <div style="margin: 20px 0; text-align: center;">
                     <span style="font-size: 24px; font-weight: bold; color: #4CAF50; border: 1px dashed #4CAF50; padding: 10px 20px; border-radius: 5px; background-color: #f9f9f9;">
                         ${otp}
                     </span>
                 </div>
                 <p>Lưu ý: Mã OTP này chỉ có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
             </main>
             <footer style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                 Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này. <br>
                 &copy; 2025 Công ty của bạn. Mọi quyền được bảo lưu.
             </footer>
         </div>
     </body>
     </html>
     `;
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/register/otp?email=${email}`);
}

// [GET]  /user/register/otp
module.exports.registerOtp = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-register.pug", {
        pageTitle: "Xác nhận OTP",
        email: email
    })
}

// [POST]  /user/register/otp
module.exports.registerOtpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    // Kiểm tra email và OTP
    const result = await RegisterOtp.findOne({ email: email, otp: otp });
    if (!result) {
        req.flash("error", "OTP không hợp lệ hoặc đã hết hạn");
        return res.redirect("back");
    }

    // Xóa OTP trước
    await RegisterOtp.deleteOne({ email: email, otp: otp });

    // Tạo user mới từ result
    const user = new User({
        fullName: result.fullName,
        email: result.email,
        password: result.password,
    });

    // Lưu user mới vào cơ sở dữ liệu
    await user.save();

    // Đặt cookie token và chuyển hướng
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

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password) {
        req.flash("error", "Mật khẩu không đúng");
        res.redirect("back");
        return;
    }

    if (user.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);
    // Lưu user_id vào collection carts
    await Cart.updateOne(
        {_id: req.cookies.cartId},
        {user_id: user.id}
    );

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

// [POST]  /user/passowrd/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    const otp = generateHelper.generateOTP(8);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Send Email 
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mã OTP Xác Minh</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <header style="background-color: #4CAF50; color: #fff; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                Mã OTP Xác Minh
            </header>
            <main style="padding: 20px;">
                <p>Xin chào,</p>
                <p>Bạn đã yêu cầu lấy lại mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã OTP dưới đây để xác minh:</p>
                <div style="margin: 20px 0; text-align: center;">
                    <span style="font-size: 24px; font-weight: bold; color: #4CAF50; border: 1px dashed #4CAF50; padding: 10px 20px; border-radius: 5px; background-color: #f9f9f9;">
                        ${otp}
                    </span>
                </div>
                <p>Lưu ý: Mã OTP này chỉ có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
            </main>
            <footer style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này. <br>
                &copy; 2025 Công ty của bạn. Mọi quyền được bảo lưu.
            </footer>
        </div>
    </body>
    </html>
    `;
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET]  /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password.pug", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}

// [POST]  /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if (!result) {
        req.flash("error", "OTP không hợp lệ");
        res.redirect("back");
        return;
    }

    // Xóa OTP sau khi xác thực thành công
    await ForgotPassword.deleteOne({
        email: email,
        otp: otp
    });

    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

// [GET]  /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password.pug", {
        pageTitle: "Đổi mật khẩu",
    })
}

// [POST]  /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const newPassword = req.body.newPassword;
    const tokenUser = req.cookies.tokenUser;

    const user = await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(newPassword)
    });

    res.redirect("/");
}

// [GET]  /user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info.pug", {
        pageTitle: "Thông tin cá nhân",
    })
}