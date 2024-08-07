// [GET] /admin/product
const Product = require("../../model/product.model")
const Accounts = require("../../model/accounts.model")
const filterStatusHelper = require("../../helper/filterStatus")
const searchHelper = require("../../helper/search")
const paginationHelper = require("../../helper/paginationHelper")
const systemConfig = require("../../config/system")
const productCategory = require("../../model/products-category.model")
const createTreeHelper = require("../../helper/createTree")
module.exports.index = async(req, res) =>{
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false,
    }
    if(req.query.status){
        find.status = req.query.status;
    }
    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc"
    }
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItem:4
        },
        req.query,
        countProducts
    )
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    for (const product of products) {
        const user = await Accounts.findOne({
            _id:product.createdBy.account_id
        })
        if(user){
            product.accountFullName = user.fullName
        }
        const updateBy = product.updatedBy[product.updatedBy.length -1]
        if(updateBy){
            const userUpdated = await Accounts.findOne({
                _id:updateBy.account_id
            })
            updateBy.accountFullName = userUpdated.fullName
        }
    }
    res.render("admin/page/products/index",{
        pageTitle: "danh sách sản phẩm",
        products : products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req, res) =>{
    const status = req.params.status;
    const id = req.params.id;
    const update = {
        account_id:String,
        updateAt:Date
        }
        req.body.updateBy = update
    await Product.updateOne({
        _id:id,
    },{
        status:status,
        $push: {updatedBy:update}
    })
    await Product.updateOne({ _id: id },{ status: status });
    req.flash("success","cập nhật trạng thái sản phẩm thành công")
    res.redirect("back")
}
// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async(req, res) =>{
    const type = req.body.type;
    const ids = req.body.ids.split(", ")
    switch (type) {
        case "active":
            await Product.updateMany({ _id: {$in:ids} },{status:"active",$push: {updatedBy:update}})
            req.flash("success", `cập nhật ${ids.length} sản phẩm thành công`)
            break;
        case "inactive":
            await Product.updateMany({ _id: {$in:ids} },{status:"inactive",$push: {updatedBy:update}})
            req.flash("success", `cập nhật ${ids.length} sản phẩm thành công`)
            break;
        case "delete-all":
            await Product.updateOne(
        { _id: {$in:ids} },
        {
            deleted : true,
            deleteBy:{
                account_id:res.locals.user.id,
                deleteAt: new Date()
            }
        });
            req.flash("success", `đã xoá ${ids.length} sản phẩm thành công`)
            break;
        case "change-position":
            for (const item of ids){
                let [id,position] = item.split("-");
                position = parseInt(position)
                await Product.updateOne({ _id: id },{ position:position,$push: {updatedBy:update} });
            }
            break;
        default:
            break;
    }
    res.redirect("back")
}
//[delete] /admin/products/delete/:id
module.exports.deleteItem = async(req, res) =>{
    const id = req.params.id;
    await Product.updateOne(
        { _id: id },
        {
            deleted : true,
            deleteBy:{
                account_id:res.locals.user.id,
                deleteAt: new Date()
            }
        });
    req.flash("success", `đã xoá sản phẩm thành công`)
    res.redirect("back")
}
//[GET] /admin/products/create
module.exports.create = async (req, res) =>{
    let find = {
        deleted:false
    }
    const records = await productCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    res.render("admin/page/products/create",{
        pageTitle:"Trang Sản phẩm",
        category:newRecords
    })
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res) =>{
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock= parseInt(req.body.stock)
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
        account_id:res.locals.user.id,
    }
    const product = new Product(req.body)
    
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}
// [get] /admin/products/edit/id

module.exports.edit = async(req,res) =>{
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const product = await Product.findOne(find);
        let find1 = {
            deleted:false
        }
        const records = await productCategory.find(find1)
        const newRecords = createTreeHelper.tree(records)
        // console.log(newRecords)
        res.render("admin/page/products/edit",{
            pageTitle:"Thêm mới Sản phẩm",
            product:product,
            category:newRecords
        })
    } catch (error) {
        req.flash("error", `Không tạo được sản phẩm này`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}
//[patch] admin/products/edit/id
module.exports.editPatch = async(req, res) =>{
    const id = req.params.id

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock= parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    if(req.file){
       req.body.thumbnail= `/uploads/${req.file.filename}`
    }
    try {
        const update = {
            account_id:String,
            updateAt:Date
            }
            req.body.updateBy = update
        await Product.updateOne({
            _id:id,
        },{
            ...req.body,
            $push: {updatedBy:update}
        })
        req.flash("success", `cập nhật sản phẩm thành công`)
        res.redirect("back")
    } catch (error) {
        req.flash("error", `cập nhật sản phẩm thất bại`)
        res.redirect("back")
    }   
}    
//[get] admin/products/detail/id
module.exports.detail = async(req,res) =>{
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const product = await Product.findOne(find);
        res.render("admin/page/products/detail",{
            pageTitle:product.title,
            product:product
        })
    } catch (error) {
        req.flash("error", `Không tạo được sản phẩm này`)
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}