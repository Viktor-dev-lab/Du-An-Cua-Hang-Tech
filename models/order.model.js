const mongoose = require('mongoose'); 

const orderSchema = new mongoose.Schema(
    {

        car_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ]
    }, 

    {
        timestamps: true
    }
);


const Order = new mongoose.model("Order", orderSchema, "orders");

module.exports = Order;


