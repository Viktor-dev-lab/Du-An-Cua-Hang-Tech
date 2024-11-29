// xuất ra tên hàm là index
// [GET] admin/dasboard
module.exports.dashboard = (req, res) => {
    

    res.render("admin/pages/dashboard/index.pug", {
        pageTitle: "Trang tổng quan"
    })
}
