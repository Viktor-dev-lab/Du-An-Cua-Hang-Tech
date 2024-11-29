const Product = require("../../models/product.model.js")

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

    // tạo mảng mới từ products
    const newProducts = products.map(item => {
        item.priceNew = item.price - (item.price * item.discountPercentage/100);
        item.priceNew =  item.priceNew.toFixed();
        return item;
    });

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

    try{
        const slug = req.params.slug
        const product = await Product.findOne({ slug: slug });
    
        res.render("client/pages/product/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch(error){
        res.redirect('/products');
    }
}

