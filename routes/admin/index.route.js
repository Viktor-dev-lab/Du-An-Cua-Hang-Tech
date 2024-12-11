const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const categoryRoutes = require('./category.route');
const RoleRoutes = require('./role.route');
const AccountRoutes = require('./account.route');
const AuthRoutes = require('./auth.route');

const systemConfig = require('../../config/system.js');



module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
    app.use(PATH_ADMIN + '/products', productRoutes);
    app.use(PATH_ADMIN + '/products-category', categoryRoutes);
    app.use(PATH_ADMIN + '/roles', RoleRoutes);
    app.use(PATH_ADMIN + '/accounts', AccountRoutes);
    app.use(PATH_ADMIN + '/auth', AuthRoutes);
};
