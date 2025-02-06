// Models
const User = require("../../models/user.model.js");

// Socket
const usersSocket = require('../../sockets/client/users.socket');
 

// [GET] /users/not-friend
module.exports.notFriends = async (req, res) => {
    // SocketIO
    usersSocket(res);
    // End SocketIO

    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        $and: [
            { _id: {$ne: userId}},
            { _id: {$nin: requestFriends}},
            { _id: {$nin: acceptFriends}},

        ],
        status: 'active',
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/index.pug", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}  

// [GET] /users/friends
module.exports.friends = async (req, res) => {

    res.render("client/pages/users/friends.pug", {
        pageTitle: "Danh sách bạn bè",
    })
}  

// [GET] /users/request
module.exports.request = async (req, res) => {
     // SocketIO
     usersSocket(res);
     // End SocketIO

    const myUserId = res.locals.user.id;
    // Lấy List user đã gửi yêu cầu
    const myUser = await User.findOne({
        _id: myUserId
    })
    const requestFriends = myUser.requestFriends;
    
    // Lấy all User trong requestFriends 
    const users = await User.find({
        _id: {$in : requestFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("client/pages/users/request.pug", {
        pageTitle: "Lời mời đã gửi",
        users: users
    })
}  

// [GET] /users/accept
module.exports.accept = async (req, res) => {
     // SocketIO
     usersSocket(res);
     // End SocketIO
     
    const myUserId = res.locals.user.id;
    // Lấy List user đã gửi yêu cầu
    const myUser = await User.findOne({
        _id: myUserId
    })
    const acceptFriends = myUser.acceptFriends;
    // Lấy all User trong acceptFriends 
    const users = await User.find({
        _id: {$in : acceptFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("client/pages/users/accept.pug", {
        pageTitle: "Lời mời kết bạn",
        users: users
    })
}  