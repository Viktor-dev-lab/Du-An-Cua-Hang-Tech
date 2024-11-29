module.exports = (req) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt Động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng Hoạt Động",
            status: "inactive",
            class: ""
        }
    ];

    // Start click active button
    //- Trường hợp có status
    if (req.query.status){
        //- So Sánh xem cái url hiện tại trùng với cái status nào trong filterStatus
        //- Thì cài đặc class tại đó là active
        const index = filterStatus.findIndex(item => item.status === req.query.status);
        filterStatus[index].class = "active";
    } else {
        filterStatus[0].class = "active";
    }

    return filterStatus;
}