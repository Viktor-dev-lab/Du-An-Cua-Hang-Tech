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

    res.render("client/pages/chat/create.pug", {
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

// [GET] /chat/add/:roomChatID
module.exports.getAddMember = async (req, res) => {
    const USER_ID = res.locals.user.id;
    const roomChatID = req.params.roomChatID;

    // Display friendList of User
    const user = await User.findOne({
        _id: USER_ID,
        status: 'active',
        deleted: false,
    });
    
    const roomChat = await RoomChat.findOne({_id: roomChatID, status: 'active', deleted: false});
    const friends_ID = user ? user.friendList.map(item => item.user_id) : [];
    const friends_ID_Group = roomChat.users.map(user => user.user_id);
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


    res.render("client/pages/chat/add.pug", {
        pageTitle: "Tin nhắn",
        roomChatID: roomChatID,
        friendList: friends,
        friends_ID_Group: friends_ID_Group
    });
};


// [POST] /chat/add/:roomChatID
module.exports.postAddMember = async (req, res) => {
    try {
        const roomChatID = req.params.roomChatID;

        // ✅ Đảm bảo newMembers luôn là mảng
        const newMembers = Array.isArray(req.body.friends_ID) ? req.body.friends_ID : [req.body.friends_ID];

        if (newMembers.length === 0) {
            return res.status(400).json({ message: "Danh sách thành viên không hợp lệ!" });
        }

        // ✅ Tạo danh sách user mới với role "user"
        const usersToAdd = newMembers.map(userId => ({
            user_id: userId,
            role: "user"
        }));

        // ✅ Cập nhật roomChat bằng cách thêm vào mảng `users`
        const updatedRoom = await RoomChat.findByIdAndUpdate(
            roomChatID,
            { $push: { users: { $each: usersToAdd } } }, 
            { new: true } // ✅ Đảm bảo trả về dữ liệu sau cập nhật
        );

        // ✅ Kiểm tra nếu cập nhật thất bại
        if (!updatedRoom) {
            return res.status(404).json({ message: "Không tìm thấy phòng chat!" });
        }

        // ✅ Chuyển hướng đến phòng chat vừa cập nhật
        res.redirect(`/room-chat/${updatedRoom.id}`);
    } catch (err) {
        console.error("Lỗi:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};
