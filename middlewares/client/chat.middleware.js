const roomChatModel = require('../../models/room-chat.model');

module.exports.isAccess = async (req, res, next) => {
    try {
        const user_ID = res.locals.user.id;
        const roomChatID = req.params.roomChatId;

        const room_chat = await roomChatModel.findOne(
            {
                _id: roomChatID,
                "users.user_id": user_ID,
                deleted: false,
            }
        ).lean(); // Giảm tải bộ nhớ khi không cần chỉnh sửa dữ liệu

        if (!room_chat) {
            return res.redirect("/");
        }

        next();
    } catch (error) {
      res.redirect("/");
    }
};
