const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// Socket
const chatSocket = require('../../sockets/client/chat.socket');

module.exports.index = async (req, res) => {
  const roomChatID = req.params.roomChatId;
  const USER_ID = res.locals.user.id;

  // SocketIO
  chatSocket(req,res);
  // End SocketIO

  // Get all of chats
  const chats = await Chat.find(
      {
          room_chat_id: roomChatID,
          deleted: false
      }
  );

  for (const chat of chats) {
      const info = await User.findOne({
          _id: chat.user_id,
      }).select("fullName");

      chat.info = info;
  } 


  const friends = [];
  // Tìm tất cả phòng chat mà user tham gia
  const roomChats = await RoomChat.find({
    "users.user_id": USER_ID,
    status: "active",
    deleted: false
  }).lean();
  
  // Nếu không có phòng chat nào, hiển thị thông báo mặc định
  if (roomChats.length === 0) {
    friends.push({
      roomChatID: null,
      name: "Chưa có bạn bè",
      avatar: "/images/default-avatar.png",
      fromMessage: "",
      lastMessage: "Hãy kết bạn và bắt đầu trò chuyện!"
    });
  } else {
    // Xử lý danh sách phòng chat
    for (const roomChat of roomChats) {
      const lastMessage = await Chat.findOne({ room_chat_id: roomChat._id })
        .sort({ createdAt: -1 })
        .lean();
  
      let fromMessage = "Bạn";
      let lastMessageUser = null;
  
      if (lastMessage && lastMessage.user_id !== USER_ID) {
        lastMessageUser = await User.findOne({ _id: lastMessage.user_id }).lean();
        fromMessage = lastMessageUser ? lastMessageUser.fullName : "Người dùng ẩn danh";
      }
  
      // Nếu là phòng chat 2 người
      if (roomChat.users.length === 2) {
        const friend = roomChat.users.find(user => user.user_id !== USER_ID);
        if (!friend) continue;
  
        const friendInfo = await User.findOne({ _id: friend.user_id, status: "active", deleted: false }).lean();
        if (!friendInfo) continue;
  
        friends.push({
          roomChatID: roomChat._id,
          name: friendInfo.fullName,
          avatar: "https://i.pravatar.cc/40?img=2",
          fromMessage: fromMessage,
          lastMessage: lastMessage ? lastMessage.content : "Chưa có tin nhắn"
        });
      }
      // Nếu là nhóm chat (từ 3 người trở lên)
      else {
        const members = await User.find({ _id: { $in: roomChat.users.map(u => u.user_id) } }).lean();
        const memberNames = members
          .filter(m => m._id.toString() !== USER_ID.toString()) // Bỏ qua bản thân
          .map(m => m.fullName)
          .slice(0, 3) // Chỉ lấy tối đa 3 tên
          .join(", ") + (members.length > 3 ? "..." : ""); // Thêm dấu "..." nếu nhiều hơn 3 người
  
        friends.push({
          roomChatID: roomChat._id,
          name: roomChat.title || memberNames || "Nhóm không tên",
          avatar: roomChat.avatar || "https://i.pravatar.cc/40?img=3",
          fromMessage: fromMessage,
          lastMessage: lastMessage ? lastMessage.content : "Chưa có tin nhắn"
        });
      }
    }
  }
  
  
  // Render sidebar bên phải
  const roomChat = await RoomChat.findOne({ _id: roomChatID }).lean();
  let friendInfo = null;

  if (roomChat) {
    if (roomChat.users.length === 2) {
      // Nếu là phòng chat 2 người
      for (const chatUser of roomChat.users) {
        if (chatUser.user_id !== USER_ID) {
          friendInfo = await User.findOne({
            _id: chatUser.user_id,
            status: "active",
            deleted: false
          }).lean();
          friendInfo.avatar = "https://i.pravatar.cc/40?img=2";
        }
      }
    } else {
      // Nếu là nhóm chat
      friendInfo = {
        fullName: roomChat.title || "Nhóm không có tên",
        avatar: "https://i.pravatar.cc/40?img=2",
        members: []
      };

      // Lấy danh sách thành viên
      for (const userIn_Room of roomChat.users) {
        const member = await User.findOne({
          _id: userIn_Room.user_id,
          status: "active",
          deleted: false
        }).lean();

        if (member) {
          friendInfo.members.push({
            fullName: member.fullName,
            avatar: "https://i.pravatar.cc/40?img=" + Math.floor(Math.random() * 70),
            role: userIn_Room.role
          });
        }
      }
    }
  }

  // Nếu không tìm thấy bạn bè, gán mặc định
  if (!friendInfo) {
    friendInfo = {
      fullName: "Người dùng không tồn tại",
      avatar: "/images/default-avatar.png"
    };
  }

  // Kiểm tra nhóm hiện tại bao nhiều người trên url
  let check = false;
  const Size_Room = await RoomChat.findOne({_id : roomChatID, status: 'active', deleted: false});
  if (Size_Room.users.length > 2) check = true;

  // Lấy danh sách tất cả Admins
  const adminUsers = roomChat.users
  .filter(user => user.role === "superAdmin")
  .map(user => user.user_id);

  res.render("client/pages/room-chat/index.pug", {
    pageTitle: "Trang Phòng Chat",
    friends: friends,
    friendInfo: friendInfo,
    chats: chats,
    sizeGroup_room: check,
    members: friendInfo.members,
    adminUsers: adminUsers,
    roomChatID: roomChatID
  });

};
