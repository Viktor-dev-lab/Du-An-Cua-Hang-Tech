module.exports.registerPost = async (req, res, next) => {
    if (!req.body.fullName){
        req.flash("error", 'Vui lòng nhập Họ tên !');
        res.redirect("back");
        return;
    }
    if (!req.body.email){
        req.flash("error", 'Vui lòng nhập Email !');
        res.redirect("back");
        return;
    }
    if (!req.body.password){
        req.flash("error", 'Vui lòng nhập Mật Khẩu !');
        res.redirect("back");
        return;
    }
    next();
}

module.exports.loginPost = async (req, res, next) => {
    if (!req.body.email){
        req.flash("error", 'Vui lòng nhập Email !');
        res.redirect("back");
        return;
    }
    if (!req.body.password){
        req.flash("error", 'Vui lòng nhập Mật Khẩu !');
        res.redirect("back");
        return;
    }
    next();
}