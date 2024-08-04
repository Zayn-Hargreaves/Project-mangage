module.exports.LoginPost = (req,res,next) =>{
    if(!req.body.email || !req.body.password){
        req.flash("error", `vui lòng nhập tiêu đề `)
        res.redirect("back")
        return
    }
    next()
}