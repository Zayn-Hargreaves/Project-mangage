const productCategory = require("../../model/products-category.model")

// [GET] /admin/dashboard 
module.exports.dashboard = async(req, res) =>{
    const static = {
        categoryProduct:{
            total:0,
            active:0,
            inactive:0,
        },
        product:{
            total:0,
            active:0,
            inactive:0,
        },
        account:{
            total:0,
            active:0,
            inactive:0,
        },
        user:{
            total:0,
            active:0,
            inactive:0,
        }
    }
    static.categoryProduct.total = await productCategory.countDocuments({
        deleted:false,
    })
    static.categoryProduct.active = await productCategory.countDocuments({
        deleted:false,
        status:"active"
    })
    static.categoryProduct.inactive = await productCategory.countDocuments({
        deleted:false,
        status:"inactive"
    })

    static.product.total = await productCategory.countDocuments({
        deleted:false,
    })
    static.product.active = await productCategory.countDocuments({
        deleted:false,
        status:"active"
    })
    static.product.inactive = await productCategory.countDocuments({
        deleted:false,
        status:"inactive"
    })

    static.account.total = await productCategory.countDocuments({
        deleted:false,
    })
    static.account.active = await productCategory.countDocuments({
        deleted:false,
        status:"active"
    })
    static.account.inactive = await productCategory.countDocuments({
        deleted:false,
        status:"inactive"
    })

    static.user.total = await productCategory.countDocuments({
        deleted:false,
    })
    static.user.active = await productCategory.countDocuments({
        deleted:false,
        status:"active"
    })
    static.user.inactive = await productCategory.countDocuments({
        deleted:false,
        status:"inactive"
    })
    res.render("admin/page/dashboard/index",{
        pageTitle: "Trang tổng quan",
        statistic:static
    })
}