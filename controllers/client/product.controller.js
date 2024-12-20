// Models
const Product = require("../../models/product.model.js");
const Category = require("../../models/product-category.model.js");

// Helpers
const productHelper = require('../../helpers/product.js');
const productCategpryHelper = require('../../helpers/product-category.js');
 
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
        status: "active",
    }).sort({position: "asc"});

    const ip = req.ip || req.connection.remoteAddress; 
    
    
    // thêm giá mới trực tiếp vào products
    // products.forEach(item => {
    //     item.priceNew = item.price - (item.price * item.discountPercentage/100);
    //     item.priceNew =  item.priceNew.toFixed();
    // })

    // Tính giá mới
    const newProducts = productHelper.priceNewProducts(products);

    res.render("client/pages/product/index.pug", {
        pageTitle: "Trang Sản Phẩm",
        products: newProducts,
    })
}  

module.exports.delete = (req, res) => {
    res.render("client/pages/product/index.pug")
}

module.exports.create = (req, res) => {
    res.render("client/pages/product/index.pug")
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug
    const product = await Product.findOne({ slug: slug });

    res.render("client/pages/product/detail.pug", {
        pageTitle: product.title,
        product: product
    });
}

module.exports.category = async (req, res) => {
    const category = await Category.findOne({
        slug: req.params.slugCategory,
        deleted: false
    });

    const listSubCategory = await productCategpryHelper.getSubCategory(category.id);
    const listSubCategoryID = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: {$in: [category.id, ...listSubCategoryID]},
        deleted: false
    }).sort({position: "desc"});

    const newProducts = productHelper.priceNewProducts(products);
    
    res.render("client/pages/product/index.pug", {
        pageTitle: category.title,
        products: newProducts
    });

}