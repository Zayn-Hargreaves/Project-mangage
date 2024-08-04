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
        featured:String,
        product_category_id:{
            type:String,
            default:""
        },
        createdBy:{
            account_id:String,
            createdAt:{
                type:Date,
                default:Date.now 
            }
        },
        deleted:{
            type:Boolean,
            default:false
        },
        deletedBy:{
            account_id:String,
            deleteAt:Date
        },
        updatedBy:[
            {
            account_id:String,
            updatedAt:Date
            }
        ],
        slug:{
            type:String,
            slug:"title",
            unique:true 
        },
    },{
        timestamps: true
    }
);
const product = mongoose.model("product", productSchema, "product");
module.exports = product;