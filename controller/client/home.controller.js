// [get] / 
const products = require("../../model/product.model")
const productHelper = require("../../helper/productHelper")
module.exports.index = async(req, res) =>{
    const productsFeatured = await products.find({
        featured:"1",
        deleted:false,
        status:"active"
    }).limit(6)
    const productNew = await products.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"}).limit(6)
    const productNew1 = productHelper.priceNewProducts(productNew)
    const productsFeatured1 = productHelper.priceNewProduct(productsFeatured)
    res.render("client/page/home/index",{
        pageTitle: "Trang chủ",
        productsFeatured:productsFeatured1,
        productsNew:productNew1
    });
}
