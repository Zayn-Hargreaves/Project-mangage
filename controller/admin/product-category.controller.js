const productCategory = require("../../model/products-category.model")
const filterStatusHelper = require("../../helper/filterStatus")
const searchHelper = require("../../helper/search")
const paginationHelper = require("../../helper/paginationHelper")
const systemConfig = require("../../config/system")
const createTreeHelper = require('../../helper/createTree')
module.exports.index = async(req, res) =>{
    const filterStatus = filterStatusHelper(req.query);
    let find= {
        deleted:false,
    }
    if(req.query.status){
        find.status = req.query.status;
    }
    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    const countProductsCategory = await productCategory.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItem:4
        },
        req.query,
        countProductsCategory
    )

    const records = await productCategory.find(find)
    .sort({position:"desc"})
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
    const newRecords = createTreeHelper.tree(records)
    res.render("admin/page/products-category/index",{
        pageTitle: "danh sách sản phẩm",
        records:newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

module.exports.create = async (req, res) =>{
    let find={
        deleted:false
    }
    const records = await productCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    // console.log(newRecords) 
    res.render("admin/page/products-category/create",{
        pageTitle:"Trang Sản phẩm",
        newRecords:newRecords,
    })
}
//[POST] /admin/products-categoru/create
module.exports.createPost = async (req, res) =>{
    const permissions = res.locals.role.permissions
    if(permissions.includes("product-category_create")){
        if(req.body.position == ""){
            const count = await productCategory.countDocuments();
            req.body.position = count + 1
        }else{
            req.body.position = parseInt(req.body.position)
        }
        const record = new productCategory(req.body)
        await record.save();
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`)
    }else{
        return;
    }
}
module.exports.changeStatus = async(req, res) =>{
    const status = req.params.status;
    const id = req.params.id;
    await productCategory.updateOne({ _id: id },{ status: status });
    req.flash("success","cập nhật trạng thái sản phẩm thành công")
    res.redirect("back")
}
// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async(req, res) =>{
    const type = req.body.type;
    const ids = req.body.ids.split(", ")
    
    switch (type) {
        case "active":
            await productCategory.updateMany({_id:ids},{status:"active"})
            req.flash("success", `cập nhật ${ids.length} sản phẩm thành công`)
            break;
        case "inactive":
            await productCategory.updateMany({_id:ids},{status:"inactive"})
            req.flash("success", `cập nhật ${ids.length} sản phẩm thành công`)
            break;
        case "delete-all":
            await productCategory.updateMany({_id:ids},{deleted:true, deleteAt: new Date()})
            req.flash("success", `đã xoá ${ids.length} sản phẩm thành công`)
            break;
        case "change-position":
            for (const item of ids){
                let [id,position] = item.split("-");
                position = parseInt(position)
                await productCategory.updateOne({ _id: id },{ position:position });
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
    await productCategory.updateOne({ _id: id }, {deleted : true, deleteAt: new Date()});
    req.flash("success", `đã xoá sản phẩm thành công`)
    res.redirect("back")
}
module.exports.edit = async(req,res) =>{
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const records = await productCategory.findOne(find);
        // console.log(records)
        const data = await productCategory.find({deleted:false}) 
        const newRecords = createTreeHelper.tree(data)
        res.render("admin/page/products-category/edit",{
            pageTitle:"Thêm mới Sản phẩm",
            records:records,
            newRecords:newRecords
        })
    } catch (error) {
        req.flash("error", `Không tạo được sản phẩm này`)
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`)
    }
}

//[patch] admin/products/edit/id
module.exports.editPatch = async(req, res) =>{
    const id = req.params.id
    req.body.position = parseInt(req.body.position)
    if(req.file){
       req.body.thumbnail= `/uploads/${req.file.filename}`
    }
    try {
        await productCategory.updateOne({
            _id:id,
        },req.body)
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
        const record = await productCategory.findOne(find);
        // console.log(record)
        res.render("admin/page/products-category/detail",{
            pageTitle:record.title,
            record:record
        })
    } catch (error) {
        req.flash("error", `Không tạo được sản phẩm này`)
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`)
    }
}   