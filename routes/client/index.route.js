const productRoutes = require('./product.route')
const homeRoutes = require('./home.route')
const rateLimit = require('express-rate-limit');

// // Configure the rate limiter to use Redis store
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
//     max: 5, // Limit each IP to 100 requests per window
//     message: 'Too many requests, please try again later.',
// });

module.exports = (app) => {
    app.use('/',homeRoutes)
    // Do bên productRoutes đã dùng get rồi nên mình chỉ cần dùng lại sử dụng use
    // Đường dẫn nối chuỗi 2 bên
    // Như /products/
    // /products/create
    // /products/delete
    app.use("/products",productRoutes)
}

