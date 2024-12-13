// Route
const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const categoryRoutes = require('./category.route');
const RoleRoutes = require('./role.route');
const AccountRoutes = require('./account.route');
const AuthRoutes = require('./auth.route');

// MiddleWare
const authMiddleWare = require(`../../middlewares/admin/auth.middleware.js`)

// Address
const systemConfig = require('../../config/system.js');



module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard',authMiddleWare.requireAuth,dashboardRoutes);
    app.use(PATH_ADMIN + '/products',authMiddleWare.requireAuth, productRoutes);
    app.use(PATH_ADMIN + '/products-category',authMiddleWare.requireAuth, categoryRoutes);
    app.use(PATH_ADMIN + '/roles',authMiddleWare.requireAuth, RoleRoutes);
    app.use(PATH_ADMIN + '/accounts',authMiddleWare.requireAuth, AccountRoutes);
    app.use(PATH_ADMIN + '/auth', AuthRoutes);
};
