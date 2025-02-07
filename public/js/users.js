// Chức năng gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
// Hết Chức năng gửi yêu cầu kết bạn

// Chức năng hủy yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
// Hết chức năng hủy yêu cầu kết bạn

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            const userId = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
}
// Hết chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");
            const userId = button.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        });
    });
}
// Hết chức năng chấp nhận kết bạn

// SEVER_RETURN_LENGTH_ACCEPTFRIEND
socket.on("SEVER_RETURN_LENGTH_ACCEPTFRIEND", (data) => {
    const badgeUserAccept = document.querySelector("[badge-users-accept]");
    const userId = badgeUserAccept.getAttribute("badge-users-accept");

    if (userId == data.userId) {
        badgeUserAccept.innerHTML = data.lengthAcceptFriends;
    }
});
// END SEVER_RETURN_LENGTH_ACCEPTFRIEND

// SEVER_RETURN_INFO_ACCEPTFRIEND
socket.on("SEVER_RETURN_INFO_ACCEPTFRIEND", (data) => {
    const dataUserAccept = document.querySelector("[data-users-accept]");
    const userId = dataUserAccept.getAttribute("data-users-accept");

    // Kiểm tra người dùng hiện tại có đúng là ông B mà server gửi info qua không
    if (userId == data.userId) {
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");
        newBoxUser.setAttribute("user-id", data.infoUserA._id);

        newBoxUser.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="/images/avatar.jpg" alt="${data.infoUserA.fullName}">
                </div>
                <div class="inner-info">
                    <div class="inner-name">${data.infoUserA.fullName}</div>
                    <div class="inner-buttons">
                        <button 
                            class="btn btn-sm btn-primary me-1" 
                            btn-accept-friend="${data.infoUserA._id}"
                        >
                            Chấp nhận
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary me-1" 
                            btn-refuse-friend="${data.infoUserA._id}"
                        >
                            Xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary me-1" 
                            btn-deleted-friend="btn-deleted-friend" 
                            disabled="disabled"
                        >
                            Đã xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-primary me-1" 
                            btn-accepted-friend="btn-accepted-friend" 
                            disabled="disabled"
                        >
                            Đã chấp nhận
                        </button>
                    </div>
                </div>
            </div>
        `
        dataUserAccept.appendChild(newBoxUser);

        // Chức năng từ chối kết bạn
        const BtnRefuseFriend = dataUserAccept.querySelectorAll("[btn-refuse-friend]");
        BtnRefuseFriend.forEach(button => {
            button.addEventListener("click", () => {
                button.closest(".box-user").classList.add("refuse");
                const userId = button.getAttribute("btn-refuse-friend");

                socket.emit("CLIENT_REFUSE_FRIEND", userId);
            });
        });
        // Hết chức năng từ chối kết bạn


        // Chức năng chấp nhận kết bạn
        const BtnAcceptFriend = dataUserAccept.querySelectorAll("[btn-accept-friend]");
        BtnAcceptFriend.forEach(button => {
            button.addEventListener("click", () => {
                button.closest(".box-user").classList.add("accepted");
                const userId = button.getAttribute("btn-accept-friend");

                socket.emit("CLIENT_ACCEPT_FRIEND", userId);
            });
        });
    // Hết chức năng chấp nhận kết bạn
    }
});
// END SEVER_RETURN_INFO_ACCEPTFRIEND

// SEVER_RETURN__CANCEL_ACCEPTFRIEND
socket.on("SEVER_RETURN__CANCEL_ACCEPTFRIEND", (data) => {
    const dataUserAccept = document.querySelector("[data-users-accept]");
    const userId = dataUserAccept.getAttribute("data-users-accept");

    // Kiểm tra người dùng hiện tại có đúng là ông B mà server gửi info qua không
    if (userId == data.ID_USER_B) {
       // Xóa A khỏi danh sách lời mời kết bạn của B
       const boxUserRemove = dataUserAccept.querySelector(`[user-id="${data.ID_USER_A}"]`);
       if (boxUserRemove){
            dataUserAccept.removeChild(boxUserRemove);
       }
    }
});
// END SEVER_RETURN__CANCEL_ACCEPTFRIEND