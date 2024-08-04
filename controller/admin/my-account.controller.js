const Account = require("../../model/accounts.model")
const md5 = require("md5")
// [GET] /admin/my-account 
module.exports.index = (req, res) =>{
    res.render("admin/page/my-account/index",{
        pageTitle: "Trang tổng quan"
    })
}
module.exports.edit = async(req, res) =>{
    res.render("admin/page/my-account/edit",{
        pageTitle:"Trang chỉnh sửa tài khoản"
    })
}
module.exports.editPatch = async(req, res) =>{
    const id = res.locals.user.id;
    const emailExist = await Account.findOne({
        _id:{$ne:id},
        email:req.body.email,
        deleted:false
    })
    if(emailExist){
        res.flash("error", `Email ${req.body.email} đã tồn tại`)
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password)
        }else{
            delete req.body.password
        }
        await Account.updateOne({_id:id},req.body)
        req.flash("success", "Cập nhật tài khoản thành công")
    }
    res.redirect("back")
}