const Cart = require('../../models/cart.model.js');

module.exports.cartId = async (req, res, next) => {
    try {
        let cart;

        if (!req.cookies.cartId) {
            // ✅ Tạo giỏ hàng mới nếu chưa có cartId trong cookie
            cart = new Cart();
            await cart.save();

            // Thiết lập thời gian hết hạn của cookie (1 năm)
            const expiresTime = 1000 * 60 * 60 * 24 * 365;
            res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresTime) });
        } else {
            // ✅ Tìm giỏ hàng trong DB
            cart = await Cart.findById(req.cookies.cartId);
        }

        // ✅ Nếu giỏ hàng không tồn tại (bị xóa trong DB), tạo lại giỏ hàng mới
        if (!cart) {
            cart = new Cart();
            await cart.save();
            res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresTime) });
        }

        // ✅ Đảm bảo `products` luôn là một mảng
        cart.products = cart.products || [];

        // ✅ Tính tổng số lượng sản phẩm trong giỏ hàng
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + (item.quantity || 0), 0);

        // ✅ Gửi giỏ hàng xuống `res.locals` để dùng trong giao diện
        res.locals.miniCart = cart;

        next();
    } catch (err) {
        console.error("Lỗi middleware giỏ hàng:", err);
        next(err); // Đảm bảo không làm sập server
    }
};
