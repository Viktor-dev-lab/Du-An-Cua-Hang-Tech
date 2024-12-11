// Phần Sửa Chi Tiết Phân Quyền
const tablePermission = document.querySelector("[table-permission]");
if (tablePermission){
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener("click", () => {
        let array = [];
        const rows = tablePermission.querySelectorAll("[data-name]"); 

        rows.forEach((row) => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            if (name == "id"){
                inputs.forEach(input => {
                    const id = input.value;
                    array.push({
                        id: id,
                        permission: []
                    });
                });
            } else {
                inputs.forEach((input,index) => {
                    const checked = input.checked;
                    if (checked) {
                        array[index].permission.push(name);
                    }
                })
            }

        });
        if (array.length>0){
            const formChangePermission = document.querySelector("#form-change-permissions");
            const inputPermission = formChangePermission.querySelector("input[name='permissions']");
            inputPermission.value = JSON.stringify(array);
            formChangePermission.submit();
        }
    });
}

//  Phần Truyền Data Checkbox
const dataRecords = document.querySelector("[data-records]");
if (dataRecords){
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermission = document.querySelector("[table-permission]");
    records.forEach((record,index) => {
        const permission = record.permission;
        permission.forEach(permission => {
            const row = tablePermission.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];

            input.checked = true;
        });
    });
}

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => {
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa sản phẩm?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#d33', // Màu cho nút "Xóa"
                cancelButtonColor: '#3085d6' // Màu cho nút "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=DELETE`;
                    formDeleteItem.action = action;
                    formDeleteItem.submit();
                }
            });
        });
    });
}
