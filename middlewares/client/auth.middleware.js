const User = require('../../models/user.model.js')

module.exports.requireAuth = async(req,res,next) => {
    //TH không có token chưa đăng nhập
    if(!req.cookies.tokenUser){
        res.redirect(`/user/login`);
        return;
    } 

    // TH nếu ng dùng tự động thay đổi token trong cookies
    const user = await User.findOne({tokenUser: req.cookies.tokenUser}).select("-password");

    if(!user){
        res.redirect(`/user/login`);
        return; 
    } 

    next();
}