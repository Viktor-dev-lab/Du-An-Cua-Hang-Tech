module.exports.loginPost = async (req, res, next) => {
    if (!req.body.password){
        req.flash("error", 'Vui lòng nhập mật khẩu !');
        res.redirect("back");
        return;
    }
    if (!req.body.email){
        req.flash("error", 'Vui lòng nhập Email !');
        res.redirect("back");
        return;
    }
    next();
}