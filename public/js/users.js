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

// Chức năng từ chối kết bạn khi đã là bạn bè
const listBtnFriend = document.querySelectorAll("[btn-refuse-is-friend]");
if (listBtnFriend.length > 0) {
    listBtnFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            const userId = button.getAttribute("btn-refuse-is-friend");

            socket.emit("CLIENT_REFUSE_IS_FRIEND", userId);
        });
    });
}
// Hết chức năng từ chối kết bạn khi đã là bạn bè

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
    // Trang lời mời kết bạn
    const dataUserAccept = document.querySelector("[data-users-accept]");
    if (dataUserAccept) {
        const userId = dataUserAccept.getAttribute("data-users-accept");
        // Kiểm tra người dùng hiện tại có đúng là ông B mà server gửi info qua không
        if (userId == data.userId) {
            const newBoxUser = document.createElement("div");
            newBoxUser.classList.add("col-4");
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
    }
    // End trang lời mời kết bạn

    // Trang Danh sách người dùng
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUserNotFriend) {
        const userId = dataUserNotFriend.getAttribute("data-users-accept");

        // Kiểm tra người dùng hiện tại có đúng là ông B mà server gửi info qua không
        if (userId == data.ID_USER_B) {
            // Xóa A khỏi danh sách lời mời kết bạn của B
            const boxUserRemove = dataUserNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if (boxUserRemove) {
                dataUserNotFriend.removeChild(boxUserRemove);
            }
        }
    }
    // End Trang danh sách người dùng


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
        if (boxUserRemove) {
            dataUserAccept.removeChild(boxUserRemove);
        }
    }
});
// END SEVER_RETURN__CANCEL_ACCEPTFRIEND

// SEVER_DELETED_NOTFRIEND
socket.on("SEVER_DELETED_NOTFRIEND", (data) => {
    const dataUserAccept = document.querySelector("[data-users-not-friend]");
    const userId = dataUserAccept.getAttribute("data-users-not-friend");

    // Kiểm tra người dùng hiện tại có đúng là ông B mà server gửi info qua không
    if (userId == data.ID_USER_B) {
        // Xóa A khỏi danh sách lời mời kết bạn của B
        const boxUserRemove = dataUserAccept.querySelector(`[user-id="${data.ID_USER_A}"]`);
        if (boxUserRemove) {
            // Tìm phần tử chứa các nút
            let buttonContainer = boxUserRemove.querySelector('.inner-buttons');

            // Xóa nút có thuộc tính 'btn-cancel-friend'
            let btnCancel = buttonContainer.querySelector('[btn-cancel-friend]');
            if (btnCancel) btnCancel.remove();

            // Tạo nút mới
            let newButton = document.createElement('button');
            newButton.className = 'btn btn-sm btn-success';
            newButton.textContent = 'Bạn bè';

            // Thêm nút mới vào container
            buttonContainer.appendChild(newButton);
            //dataUserAccept.removeChild(boxUserRemove);
        }
    }
});
// END SEVER_DELETED_NOTFRIEND


// SEVER_RETURN__REFUSE_IS_FRIEND
socket.on("SEVER_RETURN__REFUSE_IS_FRIEND", (data) => {
    const dataUserAccept = document.querySelector("[data-users]");
    const userId = dataUserAccept.getAttribute("data-users");

    // Kiểm tra người dùng hiện tại có đúng là ông B mà server gửi info qua không
    if (userId == data.ID_USER_B) {
        // Xóa A khỏi danh sách lời mời kết bạn của B
        const boxUserRemove = dataUserAccept.querySelector(`[user-id="${data.ID_USER_A}"]`);
        if (boxUserRemove) {
            dataUserAccept.removeChild(boxUserRemove);
        }
    }
});
// END SEVER_RETURN__REFUSE_IS_FRIEND


function updateUserStatus(userID_A, status) {
    const dataUserFriend = document.querySelector("[data-users-friends]");
    if (!dataUserFriend) return;

    const boxUser = dataUserFriend.querySelector(`[user-id="${userID_A}"]`);
    if (!boxUser) return;

    const statusElement = boxUser.querySelector("[status]");
    if (!statusElement) return;

    statusElement.setAttribute("status", status);
}


// SERVER_UPDATE_USER_ONLINE
socket.on("SERVER_UPDATE_USER_ONLINE", ({ userID_A }) => {
    updateUserStatus(userID_A, "Online");
});
// END SERVER_UPDATE_USER_ONLINE

// SERVER_UPDATE_USER_OFFLINE
socket.on("SERVER_UPDATE_USER_OFFLINE", ({ userID_A }) => {
    updateUserStatus(userID_A, "Offline");
});
// END SERVER_UPDATE_USER_OFFLINE
