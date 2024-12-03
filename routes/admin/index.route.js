const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const categoryRoutes = require('./category.route');

const systemConfig = require('../../config/system.js');



module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
3
    // Ngăn Chặn DDOS
    // Apply rate limiter middleware to routes
    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
    app.use(PATH_ADMIN + '/products', productRoutes);
    app.use(PATH_ADMIN + '/products-category', categoryRoutes);
};
