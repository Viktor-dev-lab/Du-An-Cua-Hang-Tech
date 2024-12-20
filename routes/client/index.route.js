const productRoutes = require('./product.route')
const homeRoutes = require('./home.route')
const rateLimit = require('express-rate-limit');

// // Configure the rate limiter to use Redis store
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
//     max: 5, // Limit each IP to 100 requests per window
//     message: 'Too many requests, please try again later.',
// });

// MiddleWare
const categoryMiddleware = require("../../middlewares/client/category.middleware.js");

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use('/',homeRoutes)
    app.use("/products",productRoutes)
    
}

