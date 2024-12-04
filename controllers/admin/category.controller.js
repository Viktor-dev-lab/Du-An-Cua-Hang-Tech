const ProductCategory = require("../../models/product-category.model");
const ProductsCategory = require("../../models/product-category.model");

// Link Web
const systemConfig = require('../../config/system.js');

// Helpers
const paginationHelpers = require("../../helpers/pagination.js");
const createTreeHelpers = require("../../helpers/createTree.js");

// [GET] admin/products-category
module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    };

     // Phân Trang
     const countProducts = await ProductCategory.countDocuments(find); // Đếm tổng số sản phẩm
     // Chức năng phân trang
     let Pagination = paginationHelpers(
         {
             currentPage: 1,
             limitPage: 4
         },
         req,
         countProducts
     );

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelpers.tree(records);

    res.render("admin/pages/category/index.pug", {
        pageTitle: "Danh Mục Sản Phẩm",
        records: newRecords,
        pagination: Pagination
    })
}

// [GET] admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelpers.tree(records);

    res.render("admin/pages/category/create.pug", {
        pageTitle: "Tạo Danh Mục Sản Phẩm",
        records: newRecords
    })
}

// [POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position === "") {
        const count = await ProductsCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};