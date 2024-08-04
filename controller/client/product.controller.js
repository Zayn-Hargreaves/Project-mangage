// [GET] /products 
const Product = require("../../model/product.model");
const ProductCategory = require("../../model/products-category.model")
const productHelper = require("../../helper/productHelper")
const productCategoryHelper = require("../../helper/product-categoryHelper")
module.exports.index = async(req, res) =>{
    const products = await Product.find({
        status:"active",
        deleted:"false"
    }).sort({position:"desc"});
    const newProduct = productHelper.priceNewProducts(products)
    res.render("client/page/product/index",{
        pageTitle:"Danh sách sản phẩm",
        products: newProduct
    });
}

module.exports.category = async(req, res) =>{
    try {
        const productCategory = await ProductCategory.findOne({
            slug:req.params.slugProductCategory,
            status:"active",
            deleted:false
        })
        // console.log(productCategory)
        const category = await productCategoryHelper.getSubcategory(productCategory.id)
        const listCategoryId = category.map(item => item.id)
        const product = await Product.find({
            product_category_id:{$in:[productCategory.id,...listCategoryId]},
            deleted:false
        }).sort({position:"desc"})  
        const newProduct = productHelper.priceNewProducts(product)
        res.render("client/page/product/index",{
            pageTitle:productCategory.title,
            products: newProduct
        });
    } catch (error) {
        req.flash("error", "không có sản phẩm trong danh mục này")
        res.redirect("back")
    }
}
//[get] products/detail/:slug
module.exports.detail = async(req, res) =>{
    try {
        const find = {
            deleted: false,
            slug:req.params.slugProduct,
            status: "active"
        }
        const product = await Product.findOne(find);
        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id:product.product_category_id,
                status:"active",
                deleted:false
            })
            product.category= category
        }
        product.priceNew = productHelper.priceNewProduct(product)
        res.render("client/page/product/detail",{
            pageTitle:product.title,
            product:product
        })
    } catch (error) {
        req.flash("error", `Không tạo được sản phẩm này`)
        res.redirect(`/products`)
    }
}