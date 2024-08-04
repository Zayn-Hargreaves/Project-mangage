const createTreeHelper = require("../../helper/createTree")
const productCategory = require("../../model/products-category.model")
module.exports.category = async (req, res, next) =>{
    const ProductCategory = await productCategory.find({deleted:false})
    const newProductCategory = createTreeHelper.tree(ProductCategory)
    res.locals.layoutProductsCategory = newProductCategory
    next();
}