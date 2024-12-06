//model
const ProductCategory = require("../../models/product-category.model");

// prefix address
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

// [GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try{
        let find = {
            deleted: false
        };
    
        const id = req.params.id;
        const record = await ProductCategory.findOne({_id: id});
        
        const records = await ProductCategory.find(find);
        const newRecords = createTreeHelpers.tree(records);
        
        res.render("admin/pages/category/edit.pug", {
            pageTitle: "Chỉnh Sửa Danh Mục Sản Phẩm",
            records: record,
            parent: newRecords
        })
    }
    catch (err){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

// [PATC] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {

    const id = req.params.id;
    req.body.position = parseInt(req.body.position)
    
    await ProductCategory.updateOne({_id:id},req.body);
    res.redirect('back');
};