const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products:[
            {
                product_id:String,
                quantity:Number
            }
        ]
    },{
        timestamps: true
    }
);
const cart = mongoose.model("cart", cartSchema, "cart");
module.exports = cart;