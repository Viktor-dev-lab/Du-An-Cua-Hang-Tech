// Models
const Product = require("../../models/product.model.js");
const Account = require("../../models/account.model.js");
const ProductCategory = require("../../models/product-category.model");
const mongoose = require('mongoose');

// prefix address
const systemConfig = require('../../config/system.js');

// Helpers
const filterStatusHelpers = require("../../helpers/filterStatus.js");
const searchHelpers = require("../../helpers/search.js");
const paginationHelpers = require("../../helpers/pagination.js");
const createTreeHelpers = require("../../helpers/createTree.js");

// [GET] admin/products
module.exports.product = async (req, res) => {
    // Start bộ lọc
    const filterStatus = filterStatusHelpers(req);
    //End bộ lọc

    let find = {
        deleted: false
    }

    // Bộ lọc trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }

    // Bộ lọc tìm kiếm
    const objectSearch = searchHelpers(req);
    if (objectSearch.keyword) {
        find.title = objectSearch.title;
    }

    // Phân Trang
    const countProducts = await Product.countDocuments(find); // Đếm tổng số sản phẩm
    // Chức năng phân trang
    let Pagination = paginationHelpers(
        {
            currentPage: 1,
            limitPage: 4
        },
        req,
        countProducts
    );

    // Sắp Xếp
    let sort = {};
    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;

    } else {
        sort.position = "asc"
    }

    const products = await Product.find(find)
        .sort(sort)
        .limit(Pagination.limitPage)
        .skip(Pagination.skip);

    for (const product of products) {
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if (user) {
            product.fullName = user.fullName;
        }
    }

    res.render("admin/pages/product/index.pug", {
        pageTitle: "Trang Sản Phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: Pagination
    })
}

// [PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const newStatus = req.params.status;
    const Id = req.params.id;

    // Chuyển đổi Id từ string sang ObjectId
    const newId = new mongoose.Types.ObjectId(Id);

    try {
        // Cập nhật trạng thái của sản phẩm
        await Product.updateOne({ _id: newId }, { status: newStatus });
        req.flash('success', 'Cập nhật sản phẩm thành công');
        // Chuyển hướng trở lại trang trước đó sau khi cập nhật thành công
        res.redirect("back");
    } catch (error) {
        console.error("Error updating product status:", error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.");
    }
};

// [PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash('success', `Cập nhật ${ids.length} sản phẩm thành công`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash('success', `Cập nhật ${ids.length} sản phẩm thành công`);
            break;
        case "delete-all":
            const deleteType = req.body.delete_type;
            if (deleteType === "permanently") {
                // Xóa vĩnh viễn các sản phẩm
                await Product.deleteMany({ _id: { $in: ids }});
                req.flash('success', `Xóa Viễn Viễn ${ids.length} sản phẩm thành công`);
            } else {
                // Xóa tạm thời các sản phẩm
                await Product.updateMany(
                    { _id: { $in: ids } }, 
                    {
                        deleted: true,
                        deletedBy: {
                            account_id: res.locals.user.id,
                            deleteAt: new Date()
                        }
                    }
                );
                req.flash('success', `Xóa tạm thời ${ids.length} sản phẩm thành công`);
            }
            break;
        case "change-position":
            for (const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Product.updateOne({_id: id}, {position: position});
            }
            req.flash('success', `Cập nhật ${ids.length} sản phẩm thành công`);
            break;
        default:
            break;
    }
    res.redirect("back");
}

// [DELETE] admin/products//delete/permanently/:id
module.exports.changeDeletePermanently = async (req, res) => {
    const id = req.params.id;
    await Product.deleteOne(
        { _id: id }, 
        { deletedAt: new Date()}
    );
    res.redirect("back");
}

// [DELETE] admin/products//delete/temporarily/:id
module.exports.changeDeleteTemporarily = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({_id:id});

    if (product.deleted === true){
        req.flash('error', `Sản phẩm đang ở thùng rác`);
        res.redirect("back");
        return;
    }

    await Product.updateOne(
        { _id: id }, 
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deleteAt: new Date()
            }
        }
    );
    res.redirect("back");
}

// [PATCH] admin/products/restore
module.exports.PatchRestore = async (req, res) => {
    // Lấy dữ liệu từ request body
    const type = req.body.type;
    const ids = req.body.ids ? req.body.ids.split(", ") : []; // Kiểm tra xem có ids không

    // Xử lý cập nhật trạng thái sản phẩm nếu có hành động
    switch (type) {
        case "restore":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: false });
            req.flash('success', `Phục hồi ${ids.length} sản phẩm thành công`);
            break;
        case "delete-all":
            // Xóa vĩnh viễn các sản phẩm
            await Product.deleteMany({ _id: { $in: ids }});
            req.flash('success', `Xóa Viễn Viễn ${ids.length} sản phẩm thành công`);
        default:
            break;
    }

    res.redirect(`${systemConfig.prefixAdmin}/products/restore`);
};

// [GET] admin/products/restore/
module.exports.GetRestore = async (req, res) => {
    // Tìm sản phẩm đã xóa để hiển thị
    let find = {
        deleted: true
    };
    const products = await Product.find(find);
    for (const product of products){
        const user = await Account.findOne({
            _id: product.deletedBy.account_id
        })
        if(user){
            product.fullName = user.fullName
        }
    }

    // Render trang với danh sách sản phẩm
    res.render("admin/pages/product/deletedItem.pug", {
        pageTitle: "Trang Sản Phẩm",
        products: products,
    });
};

// [GET] admin/products/restore/:id
module.exports.restore = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { deleted: false });
    req.flash('success', `Phục hồi sản phẩm thành công`);
    res.redirect(`${systemConfig.prefixAdmin}/products/restore`);
};

// [GET] admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelpers.tree(records);
    
    res.render("admin/pages/product/create.pug", {
        pageTitle: "Thêm mới sản phẩm",
        records: newRecords
    })
}

// [POST] admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    
    if (req.body.position === "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`); 
        
};

// [GET] admin/products//edit/:id
module.exports.edit = async (req, res) => {
    try{
        let find = {
            _id: req.params.id
        }
    
        const products = await Product.findOne(find);

        const records = await ProductCategory.find({deleted:false});
        const newRecords = createTreeHelpers.tree(records);

        res.render("admin/pages/product/edit.pug", {
            pageTitle: "Sửa Chi Tiết sản phẩm",
            product: products,
            records: newRecords
        })
    } catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products`); 
    }
}

// [PATCH] admin/products//edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try{
        await Product.updateOne({ _id:id }, req.body);
        req.flash('success', `Cập nhật sản phẩm thành công`);

    } catch(error){
        req.flash('error', `Cập nhật sản phẩm thất bại`);
    }
    res.redirect("back");
}

// [GET] admin/products//detail/:id
module.exports.detail = async (req, res) => {
    try{

        const id = req.params.id;
        const product = await Product.findOne({_id:id});

        res.render("admin/pages/product/detail.pug", {
            pageTitle: product.title,
            product: product
        })
    }
    catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products`); 
    }
}