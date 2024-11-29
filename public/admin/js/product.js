// Start button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href); //- lấy url trên thanh tìm kiếm

    buttonsStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');

            //- nếu bấm vào active hoặc inactive
            if (status) {
                url.searchParams.set("status", status); //- xét lại giá trị url VD: status=active
            } else { //- Bấm vào tất cả
                url.searchParams.delete("status");
            }
            // gán url mới vào thanh tìm kiếm trên công cụ
            window.location.href = url.href
        })
    })
}
// End button Status


// Start Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault(); // Ngăn chặn load trang
        const keyword = e.target.elements.keyword.value.trim(); // Lấy giá trị nhập trong khung tìm kiếm và loại bỏ khoảng trắng thừa
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword"); // Xóa keyword khỏi URL nếu không nhập gì
        }
        window.location.href = url.href; // Cập nhật lại link mới
    });
}

// End Form Search


// Start Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}
// End Pagination

// Start Change-Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");  

            let statusChange = (statusCurrent == "active") ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
            //.submit() giúp tự động gửi một biểu mẫu từ mã JavaScript mà không cần người dùng thực hiện hành động gửi thủ công (như nhấp vào nút "Submit").
        });
    });
}
// End Change-Status

// Start checkbox
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const checkboxAll = checkboxMulti.querySelector("input[name=checkall]");
    const checkboxID = checkboxMulti.querySelectorAll("input[name=id]");
    checkboxAll.addEventListener("click", () => {
        if (checkboxAll.checked == true) {
            checkboxID.forEach((checkbox) => {
                checkbox.checked = true;
            })
        } else {
            checkboxID.forEach((checkbox) => {
                checkbox.checked = false;
            })
        }
    });

    checkboxID.forEach((button) => {
        button.addEventListener('click', () => {
            const countCheck = checkboxMulti.querySelectorAll("input[name=id]:checked");
            checkboxAll.checked = checkboxID.length === countCheck.length;
        });
    });

}
// End checkbox

// Start Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputIds = formChangeMulti.querySelector("input[name=ids]");
    const checkboxID = checkboxMulti.querySelectorAll("input[name=id]");
    const checkboxAll = checkboxMulti.querySelector("input[name=checkall]");

    checkboxAll.addEventListener('click', () => {
        updateInputIds(); // Cập nhật ô input khi bấm vào checkbox
    });

    // Thêm sự kiện cho từng checkbox sản phẩm
    checkboxID.forEach((checkbox) => {
        checkbox.addEventListener('click', () => {
            updateInputIds(); // Cập nhật ô input khi bấm vào checkbox
        });
    });

    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault(); // Chặn load trang
        const selectElement = document.querySelector('select[name="type"]');
        const selectedValue = selectElement.value;
        const inputsChecked = checkboxMulti.querySelectorAll("input[name=id]:checked");

        if (inputsChecked.length === 0) {
            // Thay thế alert bằng SweetAlert2
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng chọn ít nhất một bản ghi!',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        } else if (selectedValue === "Chọn hành động") {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng chọn ít nhất một hành động!',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        } else if (selectedValue == "delete-all") {
            Swal.fire({
                title: 'Bạn muốn xóa sản phẩm như thế nào?',
                icon: 'warning',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Xóa vĩnh viễn',
                denyButtonText: 'Xóa tạm thời',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#d33', // Màu cho nút "Xóa vĩnh viễn"
                denyButtonColor: '#f39c12', // Màu cho nút "Xóa tạm thời"
                cancelButtonColor: '#3085d6' // Màu cho nút "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Xử lý xóa vĩnh viễn
                    // Thêm giá trị bổ sung thông qua một hidden input thay vì thay đổi value trực tiếp
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'delete_type';
                    hiddenInput.value = 'permanently';
                    formChangeMulti.appendChild(hiddenInput);

                    formChangeMulti.submit();
                    Swal.fire(
                        'Đã xóa vĩnh viễn!',
                        'Sản phẩm của bạn đã bị xóa vĩnh viễn.',
                        'success'
                    );
                } else if (result.isDenied) {
                    // Xử lý xóa tạm thời
                    // Thêm giá trị bổ sung thông qua một hidden input thay vì thay đổi value trực tiếp
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'delete_type';
                    hiddenInput.value = 'temporarily';
                    formChangeMulti.appendChild(hiddenInput);
                    formChangeMulti.submit();
                    Swal.fire(
                        'Đã xóa tạm thời!',
                        'Sản phẩm của bạn đã được chuyển vào thùng rác.',
                        'info'
                    );
                } 
            });
            
        } else if (selectedValue === "change-position") {
            let ids = [];
            inputsChecked.forEach((input) => {
                const id = input.value;
                const position = input.closest("tr").querySelector("input[name='position']").value;
                ids.push(`${id}-${position}`);
            })
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
            
        } else {
            formChangeMulti.submit();
        }
    });

    // Hàm cập nhật giá trị cho ô input với các ID đã chọn
    function updateInputIds() {
        const inputsChecked = checkboxMulti.querySelectorAll("input[name=id]:checked");
        const ids = Array.from(inputsChecked).map(input => input.value);
        inputIds.value = ids.join(", ");
    }
}

// End Form Change Multi


// Start Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => {
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Bạn muốn xóa sản phẩm như thế nào?',
                icon: 'warning',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Xóa vĩnh viễn',
                denyButtonText: 'Xóa tạm thời',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#d33', // Màu cho nút "Xóa vĩnh viễn"
                denyButtonColor: '#f39c12', // Màu cho nút "Xóa tạm thời"
                cancelButtonColor: '#3085d6' // Màu cho nút "Hủy"
            }).then((result) => {
                const id = button.getAttribute("data-id");

                if (result.isConfirmed) {
                    // Xử lý xóa vĩnh viễn
                    const action = `${path}/permanently/${id}?_method=DELETE`;
                    formDeleteItem.action = action;
                    formDeleteItem.submit();
                    Swal.fire(
                        'Đã xóa vĩnh viễn!',
                        'Sản phẩm của bạn đã bị xóa vĩnh viễn.',
                        'success'
                    );
                } else if (result.isDenied) {
                    // Xử lý xóa tạm thời
                    const action = `${path}/temporarily/${id}?_method=DELETE`;
                    formDeleteItem.action = action;
                    formDeleteItem.submit();
                    Swal.fire(
                        'Đã xóa tạm thời!',
                        'Sản phẩm của bạn đã được chuyển vào thùng rác.',
                        'info'
                    );
                }
            });
        });
    });
}
// End Delete Item


// Start Form Restore
const formRestore = document.querySelector("[form-restore]");
if (formRestore) {
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputIds = formRestore.querySelector("input[name=ids]");
    const checkboxID = checkboxMulti.querySelectorAll("input[name=id]");
    const checkboxAll = checkboxMulti.querySelector("input[name=checkall]");

    checkboxAll.addEventListener('click', () => {
        updateInputIds(); // Cập nhật ô input khi bấm vào checkbox
    });

    // Thêm sự kiện cho từng checkbox sản phẩm
    checkboxID.forEach((checkbox) => {
        checkbox.addEventListener('click', () => {
            updateInputIds(); // Cập nhật ô input khi bấm vào checkbox
        });
    });

    formRestore.addEventListener('submit', (e) => {
        e.preventDefault(); // Chặn load trang
        const selectElement = formRestore.querySelector('select[name="type"]');
        const selectedValue = selectElement.value;
        const inputsChecked = checkboxMulti.querySelectorAll("input[name=id]:checked");

        if (inputsChecked.length === 0) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng chọn ít nhất một bản ghi!',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        } else if (selectedValue === "restore") {
            Swal.fire({
                title: 'Xác nhận phục hồi',
                text: 'Bạn có chắc muốn phục hồi các sản phẩm đã chọn?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Phục Hồi',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    formRestore.submit();
                    Swal.fire(
                        'Phục hồi thành công!',
                        'Sản phẩm của bạn đã được phục hồi.',
                        'success'
                    );
                }
            });
        } else if (selectedValue === "delete-all") {
            Swal.fire({
                title: 'Xác nhận xóa tất cả',
                text: 'Bạn có chắc muốn xóa các sản phẩm đã chọn?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    formRestore.submit();
                    Swal.fire(
                        'Xóa thành công!',
                        'Sản phẩm của bạn đã được xóa.',
                        'success'
                    );
                }
            });
        } else {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng chọn ít nhất một hành động!',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    });

    // Hàm cập nhật giá trị cho ô input với các ID đã chọn
    function updateInputIds() {
        const inputsChecked = checkboxMulti.querySelectorAll("input[name=id]:checked");
        const ids = Array.from(inputsChecked).map(input => input.value);
        inputIds.value = ids.join(", ");
    }
}
// End phục hồi SP


// Start Thông báo
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.remove("alert-visible");
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.remove("alert-visible");
        showAlert.classList.add("alert-hidden");
    });
}
// End Thông báo


// Start restore one item
const ButtonRestore = document.querySelectorAll('[button-restore]');
if (ButtonRestore) {
    const FormRestore = document.querySelector('#form-restore-item');
    if (FormRestore) {
        const path = FormRestore.getAttribute("data-path"); // Đúng tên biến
        ButtonRestore.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault(); // Ngăn form gửi trực tiếp
                const Id = button.getAttribute("data-id");
                const action = `${path}/${Id}?_method=PATCH`; // Tạo URL với PATCH
                FormRestore.action = action; // Gán URL vào action
                FormRestore.submit(); // Gửi form
            });
        });
    }
}

// Sort
const DivSort = document.querySelector("[sort]");
if (DivSort){
    let url = new URL(window.location.href); //- lấy url trên thanh tìm kiếm

    const SortSelect = DivSort.querySelector("[sort-select");
    const SortClear = DivSort.querySelector("[sort-clear]");

    // Select
    SortSelect.addEventListener("change", (e) => {
        const ResultArray = e.target.value.split("-");
        const [sortKey, sortValue] = ResultArray;

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        // gán url mới vào thanh tìm kiếm trên công cụ
        window.location.href = url.href
    });

    // Button-Clear
    SortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        // gán url mới vào thanh tìm kiếm trên công cụ
        window.location.href = url.href
    });

    // Set Selected Select
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue){
        const stringSort = `${sortKey}-${sortValue}`;
        const option = SortSelect.querySelector(`option[value="${stringSort}"]`);
        option.selected = true;
    }
}


// End Sort

