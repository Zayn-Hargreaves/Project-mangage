const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // user_id:String,
        cart_id:String,
        userInfo:{
            fullName:String,
            phone:String, 
            address:String
        },
        product:[
            {
            product_id:String,
            price:Number,
            quantity:Number,
            discountPercentage:Number
            }
        ],
        deleted :{
            type:Boolean,
            default: false
        },
        deleteAt: Date
    },{
        timestamps: true
    }
);
const order = mongoose.model("order", orderSchema, "order");
module.exports = order;