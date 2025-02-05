// Models
const User = require("../../models/user.model.js");

// Socket
const usersSocket = require('../../sockets/client/users.socket');
 

// [GET] /users/not-friend
module.exports.index = async (req, res) => {
    // SocketIO
    usersSocket(res);
    // End SocketIO

    const userId = res.locals.user.id;

    const users = await User.find({
        _id: {$ne: userId},
        status: 'active',
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/index.pug", {
        pageTitle: "Trang Sản Phẩm",
        users: users
    })
}  
