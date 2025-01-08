const productRoutes = require('./product.route')
const homeRoutes = require('./home.route')
const searchRoutes = require('./search.route')
const cartRoutes = require('./cart.route')
const checkoutRoutes = require('./checkout.route')
const userroutRoutes = require('./user.route.js')

// MiddleWare
const categoryMiddleware = require("../../middlewares/client/category.middleware.js");
const cartMiddleware = require("../../middlewares/client/cart.middleware.js")

module.exports = (app) => {
    // Run first middleware
    app.use(categoryMiddleware.category); // Danh muc
    app.use(cartMiddleware.cartId); // Gio Hang

    // After route 
    app.use('/',homeRoutes)
    app.use("/products",productRoutes)
    app.use("/search",searchRoutes)
    app.use("/cart",cartRoutes)
    app.use("/checkout",checkoutRoutes)
    app.use("/user",userroutRoutes)
}

