const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");


// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    // Bắt sự kiện connect của socket.io
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
            // RealTime Return content to client
            _io.emit('SERVER_RETURN_MESSAGE', {
                userId: userId,
                fullName: fullName,
                content: content
            });
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
           socket.broadcast.emit("SEVER_RETURN_TYPING", {
            userId: userId,
            fullName: fullName,
            type: type
           });
        });
    });

    // Get all of chats
    const chats = await Chat.find({deleted: false});
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