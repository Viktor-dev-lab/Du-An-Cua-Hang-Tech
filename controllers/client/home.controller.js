//Models
const Product = require('../../models/product.model.js');
// prefix address
const systemConfig = require('../../config/system.js');
// Helpers
const productHelper = require('../../helpers/product.js');

// [GET] /
module.exports.index = async (req, res) => {
    const ProductFeatured = await Product.find({
        deleted: false,
        featured: "1",
        status: "active"
    });

    // Tính giá mới
    const hotProducts = productHelper.priceNewProducts(ProductFeatured);

    const newProducts = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position:"desc"}).limit(6);

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        products: hotProducts,
        productsNew: newProducts
    })
}

module.exports.delete = (req, res) => {
    res.render("client/pages/home/index.pug")
}

module.exports.create = (req, res) => {
    res.render("client/pages/home/index.pug")
}