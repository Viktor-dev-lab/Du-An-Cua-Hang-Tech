//model
const ProductCategory = require("../../models/product-category.model");

// Helpers
const createTreeHelpers = require("../../helpers/createTree.js");

module.exports.category = async (req,res,next) => {
    const productCategory = await ProductCategory.find({deleted: false});
    const newProductsCategory = createTreeHelpers.tree(productCategory);

    res.locals.layoutProductsCategory = newProductsCategory
    
    next();
}