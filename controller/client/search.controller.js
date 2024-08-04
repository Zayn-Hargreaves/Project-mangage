const Product = require("../../model/product.model")
const ProductHelper = require("../../helper/productHelper")
module.exports.index = async(req, res) =>{
    const keyword = req.query.keyword
    let newProducts = []
    if(keyword) {
        const regex = new RegExp(keyword,"i")
        const products = await Product.find({
            title:regex,
            deleted:false,
            status:"active"
        })
        newProducts = ProductHelper.priceNewProducts(products)
    }
    res.render("client/page/search/index",{
        pageTitle:" Kết quả tìm kiếm ",
        keyword :keyword,
        products:newProducts
    })
}