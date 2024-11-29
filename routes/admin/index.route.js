const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const systemConfig = require('../../config/system.js');
const rateLimit = require('express-rate-limit');

// // Configure the rate limiter to use Redis store
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
//     max: 5, // Limit each IP to 100 requests per window
//     message: 'Too many requests, please try again later.',
// });

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
3
    // Ngăn Chặn DDOS
    // Apply rate limiter middleware to routes
    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
    app.use(PATH_ADMIN + '/products', productRoutes);
};
