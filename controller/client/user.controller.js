const User = require("../../model/user.model")
const md5 = require("md5")
const jwt = require("jsonwebtoken")
const ForgotPassword = require("../../model/forgot-password.model")
const sendMailHelper = require("../../helper/sendEmail")
const Cart = require("../../model/cart.model")
const generateToken = user =>{
    return jwt.sign(
        {id:user._id, role:user.role}, 
        process.env.JWT_SECRET_KEY,{
        expiresIn:"356d",
    })
}
const generateRandomNumber = (length) => {

    const charaters = "0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += charaters.charAt(Math.floor(Math.random() * charaters.length));
    }

    return result;
}
module.exports.register = (req, res) =>{
    res.render("client/page/user/register",{
        pageTitle:"Trang đăng ký"
    })
}

//validate cho client
module.exports.registerPost = async(req, res) =>{
    const exitEmail = await User.findOne({
        email:req.body.email
    })
    if(exitEmail){
        req.flash("error","email đã tồn tại")
        res.redirect("back")
        return
    }else{
        req.body.password = md5(req.body.password)
        const user = new User(req.body)
        await user.save()
        res.redirect("/")
    }
}

module.exports.login = (req, res) =>{
    res.render("client/page/user/login",{
        pageTitle:"Trang đăng nhập"
    })
}

module.exports.loginPost = async(req, res) =>{
    const email = req.body.email
    const password = req.body.password
    const existUser = await User.findOne({
        email:email,
        deleted:false
    })
    if(!existUser){
        req.flash("error", "Tài khoản không tồn tại")
        return
    }
    if(md5(password) !== existUser.password){
        req.flash("error", "Sai mật khẩu")
        return
    }
    if(existUser.status === "inactive"){
        req.flash("error", "Chưa kích hoạt tài khoản")
        return
    }
    const token = generateToken(existUser);
    existUser.tokenUser = token
    res.cookie("tokenUser", token)
    existUser.save()
    if(req.cookies.cartId){
        await Cart.updateOne({
            _id:req.cookies.cartId
        },{
            user_id:existUser.id
        })
    }else{
        const cart = await Cart.findOne({
            user_id:existUser.id
        })
        res.cookie("cartId",cart.id)
    }
    await User.updateOne({
        tokenUser:token
    },{
        statusOnline:'online'
    })
    _io.once('connection', (socket)=>{
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
            userId:existUser.id,
            status:"online"
        })
    })
    res.redirect("/")
}
module.exports.logout = async(req, res) =>{
    await User.updateOne({
        tokenUser:req.cookies.tokenUser
    },{
        statusOnline:'offline'
    })
    _io.once('connection', (socket)=>{
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", {
            userId:res.locals.user.id,
            status:"offline"
        })
    })
    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
    res.redirect("/")
}
module.exports.forgotPassword = (req, res) =>{
    res.render("client/page/user/forgot-password.pug",{
        pageTitle:"Quên mật khẩu",
    })
}
module.exports.forgotPasswordPost = async(req, res) =>{
    const email = req.body.email
    const user = await User.findOne({
        email:email,
        deleted:"false"
    })
    if(!user){
        req.flash("error", "Email không tồn tại")
        res.redirect("back")
        return
    }

    const objectForgotPassword = {
        email:email,
        otp:generateRandomNumber(8),
        expiresAt:Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()
    sendMailHelper.sendMail(email,"Mã otp xác minh lấy lại mật khẩu", `Mã otp xác minh lấy lại mật khẩu là <b>${objectForgotPassword.otp}</b>. Thời hạn sử dụng là 5 phút`)

    res.redirect(`/user/password/otp?email=${email}`)
}
module.exports.otpPassword = (req, res) =>{
    const email = req.query.email
    res.render("client/page/user/otp-password",{
        pageTitle:"Trang nhập mã otp",
        email:email
    })
}
module.exports.otpPasswordPost = async(req, res) =>{
    const email = req.body.email
    const otp = req.body.otp
    const result = await ForgotPassword.findOne({
        email:email,
        otp:otp
    })
    if(!result){
        req.flash("error", "otp không hợp lệ")
        res.redirect("back")
        return
    }
    const user = await User.findOne({
        email:email
    })
    const token = generateToken(user);
    user.tokenUser = token
    res.cookie("tokenUser", token)
    user.save()
    res.redirect("/user/password/reset-password")
}

module.exports.resetPassword = (req, res) =>{
    res.render("client/page/user/reset-password",{
        pageTitle:"Trang reset mật khẩu"
    })
}
module.exports.resetPasswordPost = async(req, res) =>{
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    await User.updateOne({
        tokenUser:tokenUser
    },{
        password:md5(password)
    })
    res.redirect("/")
}
module.exports.info = async(req, res) =>{
    res.render("client/page/user/info",{
        pageTitle:"Thông tin tài khoản",
    })
}

module.exports.edit = (req, res)=>{
    res.render("client/page/user/edit",{
        pageTitle:"Trang chỉnh sửa tài khoản"
    })
}

module.exports.editPatch = async(req,res)=>{
    const id = res.locals.user.id;
    const emailExist = await User.findOne({
        _id:{$ne:id},
        email:req.body.email,
        deleted:false
    })
    if(emailExist){
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password)
        }else{
            delete req.body.password
        }
        await User.updateOne({_id:id},req.body)
        req.flash("success", "Cập nhật tài khoản thành công")
    }
    res.redirect("back")
}