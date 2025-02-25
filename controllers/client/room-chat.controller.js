const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// Socket
const chatSocket = require('../../sockets/client/chat.socket');

module.exports.index = async (req, res) => {
  const roomChatID = req.params.roomChatId;

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

  res.render("client/pages/room-chat/index.pug", {
    pageTitle: "Trang Phòng Chat",
    user: {
      name: 'Ngọc Linh',
      avatar: "https://i.pravatar.cc/40?img=1"
    },
    friends: [
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/40?img=1", fromMessage: "Bạn", lastMessage: "tôi ngủ" },
      { name: "Trần Thị B", avatar: "https://i.pravatar.cc/40?img=2", fromMessage: "Bạn", lastMessage: "tôi đói" },
      { name: "Lê Văn C", avatar: "https://i.pravatar.cc/40?img=3", fromMessage: "Linh", lastMessage: "tôi dậy" },
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/40?img=1", fromMessage: "Bạn", lastMessage: "tôi ngủ" },
      { name: "Trần Thị B", avatar: "https://i.pravatar.cc/40?img=2", fromMessage: "Bạn", lastMessage: "tôi đói" },
      { name: "Lê Văn C", avatar: "https://i.pravatar.cc/40?img=3", fromMessage: "Linh", lastMessage: "tôi dậy" },
      { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/40?img=1", fromMessage: "Bạn", lastMessage: "tôi ngủ" },
      { name: "Trần Thị B", avatar: "https://i.pravatar.cc/40?img=2", fromMessage: "Bạn", lastMessage: "tôi đói" },
      { name: "Lê Văn C", avatar: "https://i.pravatar.cc/40?img=3", fromMessage: "Linh", lastMessage: "tôi dậy" },
    ],
    messages: [
      { from: "user_123", text: "Xin chào!" },
      { from: "user_456", text: "Chào bạn!" },
      { from: "user_123", text: "Hôm nay bạn thế nào?" },
      { from: "user_456", text: "Mình ổn, còn bạn?" },
    ],
    chats: chats
  });
};
