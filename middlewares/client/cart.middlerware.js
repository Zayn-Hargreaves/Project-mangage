const Cart = require("../../model/cart.model")
module.exports.cardId = async (req, res, next) =>{
    if(!req.cookies.cartId){
        const cart = new Cart()
        await cart.save()
        const expiresCookie = 365*24*60*60*1000
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        })
    }else{
        const cart = await Cart.findOne({
            _id:req.cookies.cartId
        })
        // console.log(cart)
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0)
        res.locals.miniCart = cart
    }
    next();
}