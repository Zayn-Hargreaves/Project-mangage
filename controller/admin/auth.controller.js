const Account = require("../../model/accounts.model")
const md5 = require("md5");
const systemConfig = require("../../config/system");
// [GET] /admin/dashboard 
const jwt = require("jsonwebtoken")
const generateToken = user =>{
    return jwt.sign(
        {id:user._id, role:user.role}, 
        process.env.JWT_SECRET_KEY,{
        expiresIn:"356d",
    })
}
module.exports.login = async(req, res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }else{
        res.render("admin/page/auth/login", {
            pageTitle: "Trang tổng quan"
        })
    }
}
module.exports.loginPost = async(req, res) =>{
    const email = req.body.email
    const password = req.body.password
    const user = await Account.findOne({
        email:email,
        deleted:false       
    })
    if(!user){
        res.flash("error","Email không tồn tại")
        res.redirect("back")
        return
    }else{
        console.log(user.password)
        console.log(md5(password))
        if (md5(password) != user.password) {
            req.flash("error", "Sai mật khẩu");
            res.redirect("back");
            return;
        }else if (user.status == "inactive") {
            req.flash("error", "Tài khoản đã bị khóa");
            res.redirect("back");
            return;
        }else{
            const token = generateToken(user);
            user.token = token
            await user.save()
            res.cookie("token", user.token);
            res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
        }
    }
}
module.exports.logout = async (req, res, next) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}