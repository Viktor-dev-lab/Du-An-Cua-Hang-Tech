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