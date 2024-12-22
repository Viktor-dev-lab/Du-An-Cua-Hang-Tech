//model
const ProductCategory = require("../../models/product-category.model");

// prefix address
const systemConfig = require('../../config/system.js');
const mongoose = require('mongoose');

// Helpers
const paginationHelpers = require("../../helpers/pagination.js");
const createTreeHelpers = require("../../helpers/createTree.js");

// [GET] admin/products-category
module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelpers.tree(records);

    res.render("admin/pages/category/index.pug", {
        pageTitle: "Danh Mục Sản Phẩm",
        records: newRecords
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
        const count = await ProductCategory.countDocuments();
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

// [PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {

    const id = req.params.id;
    req.body.position = parseInt(req.body.position)
    
    await ProductCategory.updateOne({_id:id},req.body);
    res.redirect('back');
};

// [DELETE] admin/products-category/delete/:id
module.exports.delete = async (req, res) => {

    const id = req.params.id;
    await ProductCategory.updateOne(
        { _id: { $in: id } }, 
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deleteAt: new Date()
            }
        }
    );
    req.flash('success', `Xóa sản phẩm thành công`);
};


// [PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const newStatus = req.params.status;
    console.log(newStatus);
    const Id = req.params.id;
    const update = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }

    // Chuyển đổi Id từ string sang ObjectId
    const newId = new mongoose.Types.ObjectId(Id);

    try {
        // Cập nhật trạng thái của sản phẩm
        await ProductCategory.updateOne({ _id: newId }, { status: newStatus, $push: {updatedBy: update}});
        req.flash('success', 'Cập nhật sản phẩm thành công');
        // Chuyển hướng trở lại trang trước đó sau khi cập nhật thành công
        res.redirect("back");
    } catch (error) {
        console.error("Error updating product status:", error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.");
    }
};