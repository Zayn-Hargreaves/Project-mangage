module.exports.LoginPost = (req,res,next) =>{
    if(!req.body.email || !req.body.password){
        req.flash("error", `vui lòng nhập tiêu đề `)
        res.redirect("back")
        return
    }
    next()
}
module.exports.registerPost = (req, res, next) =>{
    if(!req.body.email || !req.body.password){
        req.flash("error", `vui lòng nhập email hoặc mật khẩu `)
        res.redirect("back")
        return
    }
    next()
}

module.exports.forgotPasswordPost = (req, res, next) =>{
    if(!req.body.email){
        req.flash("error", `vui lòng nhập email `)
        res.redirect("back")
        return
    }
    next()
}
module.exports.resetPasswordPost = (req, res, next) =>{
    if(!req.body.password){
        req.flash("error", `vui lòng nhập mật khẩu `)
        res.redirect("back")
        return
    }
    if(!req.body.confirmPassword){
        req.flash("error", `vui lòng nhập mật khẩu `)
        res.redirect("back")
        return
    }
    if(req.body.password !== req.body.confirmPassword){
        req.flash("error", `vui lòng nhập mật khẩu `)
        res.redirect("back")
        return
    }
    next()
}