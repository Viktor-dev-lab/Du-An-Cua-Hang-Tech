// Models
const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");

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

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try{
        const slug = req.params.slugProduct;
        const find = {
            deleted: false,
            slug: slug,
            status: "active"
        };
    
        const product = await Product.findOne(find).lean();

        if (product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            product.category = category;
        }

        product.priceNew = productHelper.priceNewProduct(product);

    
        res.render("client/pages/product/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch(error){
        console.log(error);
        res.redirect(`/products`);
    }
}

module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false
    });

    if (category){
        const listSubCategory = await productCategpryHelper.getSubCategory(category.id);
        const listSubCategoryID = listSubCategory.map(item => item.id);
    }

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