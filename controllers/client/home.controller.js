// xuất ra tên hàm là index
// [GET] /
module.exports.index = (req, res) => {
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ"
    })
}

module.exports.delete = (req, res) => {
    res.render("client/pages/home/index.pug")
}

module.exports.create = (req, res) => {
    res.render("client/pages/home/index.pug")
}