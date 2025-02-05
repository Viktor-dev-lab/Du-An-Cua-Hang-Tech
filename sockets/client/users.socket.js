module.exports = async(res) => {
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (ID_USER_B) => {
            const ID_USER_A = res.locals.user.id;

            console.log(myUserId);
            console.log(userId);
        });
    });
}