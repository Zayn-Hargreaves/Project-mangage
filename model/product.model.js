const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater")
mongoose.plugin(slug)
const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        status: String,
        thumbnail: String,
        position:Number,
        deleted :{
            type:Boolean,
            default: false
        },
        slug:{
            type:String,
            slug:"title",
            unique:true 
        },
        deleteAt: Date
    },{
        timestamps: true
    }
);
const product = mongoose.model("product", productSchema, "product");
module.exports = product;