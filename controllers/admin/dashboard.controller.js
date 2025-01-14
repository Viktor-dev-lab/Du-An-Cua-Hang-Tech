// Models
const ProductCategory = require("../../models/product-category.model.js");
const Product = require("../../models/product.model.js");
const Account = require("../../models/account.model.js");
const User = require("../../models/user.model.js");


// [GET] admin/dasboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProducts: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    // categoryProducts
    statistic.categoryProducts.total = await ProductCategory.countDocuments({deleted: false});
    statistic.categoryProducts.active = await ProductCategory.countDocuments({status: "active", deleted: false});
    statistic.categoryProducts.inactive = await ProductCategory.countDocuments({status: "inactive", deleted: false});

    // product
    statistic.product.total = await Product.countDocuments({deleted: false});
    statistic.product.active = await Product.countDocuments({status: "active", deleted: false});
    statistic.product.inactive = await Product.countDocuments({status: "inactive", deleted: false});

    // account
    statistic.account.total = await Account.countDocuments({deleted: false});
    statistic.account.active = await Account.countDocuments({status: "active", deleted: false});
    statistic.account.inactive = await Account.countDocuments({status: "inactive", deleted: false});

    // user
    statistic.user.total = await User.countDocuments({deleted: false});
    statistic.user.active = await User.countDocuments({status: "active", deleted: false});
    statistic.user.inactive = await User.countDocuments({status: "inactive", deleted: false});

    res.render("admin/pages/dashboard/index.pug", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    })
}
