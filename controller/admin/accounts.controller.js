// [GET] /admin/dashboard 
const md5 = require("md5");
const Accounts = require("../../model/accounts.model")
const Roles = require("../../model/roles.model")
const systemConfig = require("../../config/system")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const accounts = await Accounts.find(find).select("-password -token")
    for (const account of accounts) {
        const role = await Roles.findOne({
            _id: account.role_id,
            deleted: false
        })
        account.role = role
    }
    // console.log(accounts)    
    res.render("admin/page/accounts/index", {
        pageTitle: "Trang quản lý tài khoản",
        records: accounts
    })
}
module.exports.create = async (req, res) => {
    const roles = await Roles.find({ deleted: false })
    res.render("admin/page/accounts/create", {
        pageTitle: "Trang tạo tài khoản",
        roles: roles
    })
}
module.exports.createPost = async (req, res) => {
    const emailExist = await Accounts.findOne({
        email:req.body.email,
        deleted:false
    })
    if(emailExist){
        res.flash("error", `email ${req.body.email} đã tồn tại`)
        res.redirect("back")
    }else{
        req.body.password = md5(req.body.password);
        const records = new Accounts(req.body);
        await records.save();
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}

module.exports.edit = async (req, res) => {
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const accounts = await Accounts.findOne(find);
        let find1 = {
            deleted: false
        }
        // console.log(accounts)
        const roles = await Roles.find(find1)
        res.render("admin/page/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: accounts,
            roles: roles
        })
    } catch (error) {
        req.flash("error", `không có tài khoản`)
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
    }
}

module.exports.editPatch = async(req, res) =>{
    const id = req.params.id
    const emailExist = await Accounts.findOne({
        _id:{$ne :id},
        email:req.body.email,
        deleted:false
    })
    if(emailExist){
        req.flash("error", `email ${req.body.email} đã tồn tại`)
        res.redirect("back")
    }else{
        if(req.file){
            req.body.avatar= `/uploads/${req.file.filename}`
        }
        if(req.body.password){
           req.body.password = md5(req.body.password);
        }else{
            delete req.body.password
        }
        try {
            await Accounts.updateOne({
                _id:id,
            },req.body)
            req.flash("success", `cập nhật sản phẩm thành công`)
            res.redirect("back")
        } catch (error) {
            req.flash("error", `cập nhật sản phẩm thất bại`)
            res.redirect("back")
        } 
    }
}