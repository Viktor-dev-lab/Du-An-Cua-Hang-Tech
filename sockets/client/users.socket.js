// Models
const User = require("../../models/user.model.js");

module.exports = async(res) => {
    _io.once('connection', (socket) => {
        // Người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (ID_USER_B) => {
            const ID_USER_A = res.locals.user.id;

            // Thêm ID của A vào acceptFriends của B
            // Kiểm tra tồn tại trc khi thêm
            const existUserAinB = await User.findOne({
                _id: ID_USER_B,
                acceptFriends: ID_USER_A
            });

            if (!existUserAinB){
                await User.updateOne(
                    {_id: ID_USER_B},
                    {$push: {acceptFriends: ID_USER_A}}
                );
            }

            // Thêm ID của B vào requestFriends của A
            // Kiểm tra tồn tại trc khi thêm
            const existUserBinA = await User.findOne({
                _id: ID_USER_A,
                requestFriends: ID_USER_B
            });

            if (!existUserBinA){
                await User.updateOne(
                    {_id: ID_USER_A},
                    {$push: {requestFriends: ID_USER_B}}
                );
            }
        });

         // Người dùng hủy yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (ID_USER_B) => {
            const ID_USER_A = res.locals.user.id;

            // Xóa ID của A vào acceptFriends của B
            // Kiểm tra tồn tại trc khi thêm
            const existUserAinB = await User.findOne({
                _id: ID_USER_B,
                acceptFriends: ID_USER_A
            });

            if (existUserAinB){
                await User.updateOne(
                    {_id: ID_USER_B},
                    {$pull: {acceptFriends: ID_USER_A}}
                );
            }

            // Xóa ID của B vào requestFriends của A
            // Kiểm tra tồn tại trc khi thêm
            const existUserBinA = await User.findOne({
                _id: ID_USER_A,
                requestFriends: ID_USER_B
            });

            if (existUserBinA){
                await User.updateOne(
                    {_id: ID_USER_A},
                    {$pull: {requestFriends: ID_USER_B}}
                );
            }
        });
    });
}