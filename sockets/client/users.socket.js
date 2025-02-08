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

        // Người dùng hủy yêu cầu kết bạn khi A-> gửi kết bạn cho B
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

            // SERVER trả về thông tin để từ chối KB (khung thông tin user kết bạn) 
            // Lấy thông tin của B trả về cho B
            socket.broadcast.emit("SEVER_RETURN__CANCEL_ACCEPTFRIEND", {
                ID_USER_B: ID_USER_B,
                ID_USER_A: ID_USER_A
            })

        });

        // Người dùng từ chối kết bạn khi khi A-> gửi kết bạn cho B
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
                        },
                        $pull: {acceptFriends: ID_USER_B}
                    },
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
                        },
                        $pull: {requestFriends: ID_USER_A}
                    },
                );
            }

            // Khi người dùng B chấp nhận thì phải xóa info A 
            // Trong trang danh sách người dùng
            socket.broadcast.emit("SEVER_DELETED_NOTFRIEND", {
                ID_USER_B: ID_USER_B,
                ID_USER_A: ID_USER_A,
            })
        });

        // Người dùng hủy yêu cầu kết bạn khi là bạn bè giữa A-B
        socket.on("CLIENT_REFUSE_IS_FRIEND", async (ID_USER_B) => {
            const ID_USER_A = res.locals.user.id;

            // Xóa ID của A trong friendList của B
            await User.updateOne(
                { _id: ID_USER_B }, // Tìm user B
                { $pull: { friendList: { user_id: ID_USER_A } } } // Xóa ID_A khỏi friendList
            );

            // Xóa ID của B vào friendList của A
            await User.updateOne(
                { _id: ID_USER_A }, // Tìm user B
                { $pull: { friendList: { user_id: ID_USER_B } } } // Xóa ID_A khỏi friendList
            );

            // SERVER trả về thông tin để hủy KB (khung thông tin user kết bạn) 
            // Lấy thông tin của B trả về cho B
            socket.broadcast.emit("SEVER_RETURN__REFUSE_IS_FRIEND", {
                ID_USER_B: ID_USER_B,
                ID_USER_A: ID_USER_A
            })
        });
    });
}