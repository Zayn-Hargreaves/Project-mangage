module.exports.createPost = (req,res,next) =>{
    if(!req.body.title){
        req.flash("error", `vui lòng nhập tên `)
        res.redirect("back")
        return
    }
    next()
}