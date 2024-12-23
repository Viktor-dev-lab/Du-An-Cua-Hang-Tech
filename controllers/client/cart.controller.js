// Models
const Cart = require("../../models/cart.model.js");

// Helpers
const productHelper = require('../../helpers/product.js');
 
// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({_id: cartId});
    const existProductInCart = cart.products.find(item => item.product_id === productId);

    // If the product already exists in the cart, it will be updated.
    if (existProductInCart){
        const newQuantity = quantity + existProductInCart.quantity;
        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        );
    }
    else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
    
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: {products: objectCart}
            }
        )
    }
    req.flash("success", "Them San Pham vao gio hang thanh cong");
    res.redirect("back");
}  
