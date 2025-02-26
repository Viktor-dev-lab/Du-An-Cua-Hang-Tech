const RoomChat = require("../../models/room-chat.model");
const User = require("../../models/user.model");


// [GET] /chat/create
module.exports.index = async (req, res) => {
    const USER_ID = res.locals.user.id;

    // Display friendList of User
    const user = await User.findOne({
        _id: USER_ID,
        status: 'active',
        deleted: false,
    });
    
    const friends_ID = user ? user.friendList.map(item => item.user_id) : [];
    const friends = [];

    for (const friendID of friends_ID) {
        const info_Friend = await User.findOne({
            _id: friendID,
            status: "active",
            deleted: false
        }).select("_id fullName avatar");
        info_Friend.avatar = "https://i.pravatar.cc/40?img=2";
        friends.push(info_Friend);
    }

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Tin nhắn",
        friendList: friends
    });
};

// [POST] /chat/create
module.exports.createPost = async (req, res) => {
    try {
        const title = req.body.roomTitle;
        const userID = req.body.friends_ID;

        const dataChat = {
            title: title,
            typeRoom: "group",
            users: [],
            theme: 'blue',
            color: 'white',
            status: 'active',
        };

        // Thêm từng thành viên vào nhóm
        userID.forEach(userId => {
            dataChat.users.push({
                user_id: userId,
                role: "user",
            });
        });

        // Thêm người tạo nhóm với quyền Super Admin
        dataChat.users.push({
            user_id: res.locals.user.id,
            role: "superAdmin"
        });

        // Lưu nhóm vào DB
        const room = new RoomChat(dataChat);
        await room.save();

        // Chuyển hướng đến phòng chat vừa tạo
        res.redirect(`/room-chat/${room.id}`);
    } catch (error) {
        console.error("Lỗi tạo phòng chat:", error);
        res.status(500).send("Đã xảy ra lỗi khi tạo phòng chat.");
    }
};
