const Chat = require("../../models/chat.model");

// Clound
const uploadCloundinary = require('../../helpers/uploadCloundinary');

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatID = req.params.roomChatId;

    // Bắt sự kiện connect của socket.io
    _io.once('connection', (socket) => {

        // Join phòng chat đúng với ID
        socket.join(roomChatID);

        // SEND MESSAGE
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {

            // Save the images to the cloundinary
            let images = [];
            for (const imageBuffer of data.images) {
                const link = await uploadCloundinary(imageBuffer);
                images.push(link);
            }

            // Save the data to the database
            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatID,
                content: data.content,
                images: images
            });
            await chat.save();

            // RealTime Return data to client
            _io.to(roomChatID).emit('SERVER_RETURN_MESSAGE', {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            });
        });

        // TYPING 
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatID).emit("SEVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
    });
}