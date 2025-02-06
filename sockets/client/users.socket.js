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

            // SERVER trả về số lượng acceptFriends (Biểu tượng icon) của lời mời kết bạn
            // Lấy độ dài acceptFriends của B trả về client đến B
            const infoUserB = await User.findOne({_id: ID_USER_B});
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPTFRIEND", {
                userId: ID_USER_B,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // SERVER trả về thông tin (khung thông tin user kết bạn) 
            // Lấy thông tin của A trả về cho B
            const infoUserA = await User.findOne({_id: ID_USER_A}).select("id avatar fullName");
            socket.broadcast.emit("SEVER_RETURN_INFO_ACCEPTFRIEND", {
                userId: ID_USER_B,
                infoUserA: infoUserA
            });


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

            // Lấy độ dài acceptFriends của B trả về client đến B
            const infoUserB = await User.findOne({_id: ID_USER_B});
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPTFRIEND", {
                userId: ID_USER_B,
                lengthAcceptFriends: lengthAcceptFriends
            })
        });

        // Người dùng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (ID_USER_B) => {
            const ID_USER_A = res.locals.user.id;

            // Xóa ID của B vào acceptFriends của A
            // Kiểm tra tồn tại trc khi thêm
            const existUserAinB = await User.findOne({
                _id: ID_USER_A,
                acceptFriends: ID_USER_B
            });

            if (existUserAinB){
                await User.updateOne(
                    {_id: ID_USER_A},
                    {$pull: {acceptFriends: ID_USER_B}}
                );
            }

            // Xóa ID của A vào requestFriends của B
            // Kiểm tra tồn tại trc khi thêm
            const existUserBinA = await User.findOne({
                _id: ID_USER_B,
                requestFriends: ID_USER_A
            });

            if (existUserBinA){
                await User.updateOne(
                    {_id: ID_USER_B},
                    {$pull: {requestFriends: ID_USER_A}}
                );
            }
        });

        // Người dùng chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (ID_USER_B) => {
            const ID_USER_A = res.locals.user.id;
            
            // THêm {user_id, room_chat_id} của A vào friendList của B
            // Xóa ID của A trong acceptFriends của B
            // Kiểm tra tồn tại trc khi thêm
            const existUserAinB = await User.findOne({
                _id: ID_USER_A,
                acceptFriends: ID_USER_B
            });

            if (existUserAinB){
                await User.updateOne(
                    {_id: ID_USER_A},
                    {
                        $push: {
                            friendList: {
                                user_id: ID_USER_B,
                                room_chat_id: ""
                            }
                        }
                    },
                    {$pull: {acceptFriends: ID_USER_B}}
                );
            }

            // THêm {user_id, room_chat_id} của B vào friendList của A
            // Xóa ID của B trong requestFriends của A
            // Kiểm tra tồn tại trc khi thêm
            const existUserBinA = await User.findOne({
                _id: ID_USER_B,
                requestFriends: ID_USER_A
            });

            if (existUserBinA){
                await User.updateOne(
                    {_id: ID_USER_B},
                    {
                        $push: {
                            friendList: {
                                user_id: ID_USER_A,
                                room_chat_id: ""
                            }
                        }
                    },
                    {$pull: {requestFriends: ID_USER_A}}
                );
            }
        });
    });
}