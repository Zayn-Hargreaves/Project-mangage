module.exports.createPost = (req,res,next) =>{
    if(!req.body.fullName){
        req.flash("error", `vui lòng nhập tên `)
        res.redirect("back")
        return
    }
    next()
}
module.exports.editPatch = (req, res, next) =>{
    if(!req.body.password){
        req.flash("error", `vui lòng nhập mật khẩu `)
        res.redirect("back")
        return
    }
    next()
}