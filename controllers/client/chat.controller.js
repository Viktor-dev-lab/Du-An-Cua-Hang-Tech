const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// Socket
const chatSocket = require('../../sockets/client/chat.socket');


// [GET] /chat
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

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Tin nhắn",
        chats: chats
    })
}