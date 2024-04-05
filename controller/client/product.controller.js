// [GET] /products 
const Product = require("../../model/product.model");

module.exports.index = async(req, res) =>{
    const products = await Product.find({
        status:"active",
        deleted:"false"
    }).sort({position:"desc"});
    const newProduct = products.map(item =>{
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
        return item;
    })
    console.log(newProduct)
    res.render("client/page/product/index",{
        pageTitle:"Danh sách sản phẩm",
        products: newProduct
    });
}
//[get] products/:slug
module.exports.detail = async(req, res) =>{
    try {
        const find = {
            deleted: false,
            slug:req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find);
        res.render("client/page/product/detail",{
            pageTitle:product.title,
            product:product
        })
    } catch (error) {
        req.flash("error", `Không tạo được sản phẩm này`)
        res.redirect(`/products`)
    }
}