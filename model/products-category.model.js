const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater")
mongoose.plugin(slug)
const productCategorySchema = new mongoose.Schema(
    {
        title: String,
        parent_id:{
            type:String,
            default:"",
        },
        description: String,
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
const productCategory = mongoose.model("productCategory", productCategorySchema, "products-category");
module.exports = productCategory;