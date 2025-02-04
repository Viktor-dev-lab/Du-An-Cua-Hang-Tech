const Cart = require('../../models/cart.model.js');

module.exports.cartId = async (req, res, next) => {
    try {
        let cart;

        // Nếu không có cartId trong cookies, tạo giỏ hàng mới
        if (!req.cookies.cartId) {
            cart = new Cart();
            await cart.save();

            const expiresTime = 1000 * 60 * 60 * 24 * 365;
            res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresTime) });
        } else {
            // Nếu đã có cartId, tìm trong database
            cart = await Cart.findById(req.cookies.cartId);
            
            // Nếu không tìm thấy giỏ hàng, tạo mới và gán lại cartId
            if (!cart) {
                cart = new Cart();
                await cart.save();
                res.cookie("cartId", cart.id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
            }
        }

        // Kiểm tra nếu `products` tồn tại trước khi tính tổng số lượng
        cart.totalQuantity = (cart.products || []).reduce((sum, item) => sum + item.quantity, 0);

        // Gán giỏ hàng vào biến `res.locals.miniCart` để sử dụng ở view
        res.locals.miniCart = cart;

        next();
    } catch (error) {
        console.error("Lỗi trong middleware cartId:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi xử lý giỏ hàng" });
    }
};
