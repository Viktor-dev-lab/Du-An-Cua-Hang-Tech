// [GET] /chat
module.exports.index = async (req, res) => {
    // Bắt sự kiện connect của socket.io
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    });

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Tin nhắn",
    })
}