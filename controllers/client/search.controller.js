// Models
const Product = require("../../models/product.model.js");

// Helpers
const productHelper = require('../../helpers/product.js');
 
// [GET] /search
module.exports.index = async (req, res) => {

    const keyword = req.query.keyword;
    let newProducts = []

    if (keyword){
        const keywordRegex = new RegExp(keyword, 'i');

        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        });
        newProducts = productHelper.priceNewProducts(products);
    }

    res.render("client/pages/search/index.pug", {
        pageTitle: "Trang Sản Phẩm",
        keyword: keyword,
        newProducts: newProducts
    })
}  
