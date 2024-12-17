// prefix address
const systemConfig = require('../../config/system.js');

// [GET] /
module.exports.index = async (req, res) => {
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
    })
}

module.exports.delete = (req, res) => {
    res.render("client/pages/home/index.pug")
}

module.exports.create = (req, res) => {
    res.render("client/pages/home/index.pug")
}