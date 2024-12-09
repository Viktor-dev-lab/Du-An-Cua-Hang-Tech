//model
const Role = require("../../models/roles.model");

// prefix address
const systemConfig = require('../../config/system.js');

// Helpers
const paginationHelpers = require("../../helpers/pagination.js");
const createTreeHelpers = require("../../helpers/createTree.js");

// [GET] admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const roles = await Role.find(find);

    res.render("admin/pages/role/index.pug", {
        pageTitle: "Nhóm quyền",
        roles: roles
    })
}

// [GET] admin/roles/create
module.exports.create = async (req, res) => {

    res.render("admin/pages/role/create.pug", {
        pageTitle: "Nhóm quyền",
    })
}

// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;
        const roles = await Role.findOne({_id: id});
    
        res.render("admin/pages/role/edit.pug", {
            pageTitle: "Nhóm quyền",
            roles: roles
        })
    } catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try{
        const id = req.params.id;
        await Role.updateOne({_id: id},req.body);
        
        res.redirect("back");
    } catch(err){

    }
}

// [GET] admin/roles/permission/
module.exports.permission = async (req, res) => {
    try{
        let find = {
            deleted: false
        }
    
        const roles = await Role.find(find);
    
        res.render("admin/pages/role/permission.pug", {
            pageTitle: "Chi Tiết Phân Quyền",
            records: roles
        })
    } catch(err){

    }
}


// [PATCH] admin/roles/permission/
module.exports.permissionPatch = async (req, res) => {

    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        await Role.updateOne({_id: item.id}, {permission: item.permission});
    }
    req.flash("success","Cập Nhật Phân Quyền Thành Công")

    res.redirect(`${systemConfig.prefixAdmin}/roles/permission`);
}