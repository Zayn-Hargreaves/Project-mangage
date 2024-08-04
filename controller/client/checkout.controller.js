const Cart = require("../../model/cart.model")
const productHelper = require("../../helper/productHelper")
const Product = require("../../model/product.model")
const Order = require("../../model/order.model")
module.exports.index = async(req, res) =>{
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
         _id:cartId
    })
    if(cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id
            const productInfo = await Product.findOne({
                _id:productId,
            }).select("title thumbnail slug price discountPercentage")
            productInfo.priceNew = productHelper.priceNewProduct(productInfo)
            item.productInfo = productInfo
            item.totalPrice = productInfo.priceNew * item.quantity
        }
    }
    cart.totalPrice = cart.products.reduce((sum, item) =>
        sum + item.quantity* item.totalPrice
    ,0)
    res.render("client/page/checkout/index",{
        pageTitle:"Đặt Hàng",
        cartDetail:cart
    })
}



module.exports.orderPost = async(req, res) =>{
    const cartId = req.cookies.cartId
    const userInfo = req.body
    const cart = await Cart.findOne({
        _id:cartId
    })
    let products= []
    for (const product of cart.products) {
        const objectProduct = {
            product_id:product.product_id,
            price:0,
            discountPercentage:0,
            quantity:product.quantity
        }
        const productInfo = await Product.findOne({
            _id:product.product_id
        }).select("price discountPercentage")

        objectProduct.price = productInfo.price
        objectProduct.discountPercentage = productInfo.discountPercentage
        products.push(objectProduct)
    }
    const objectOrder = {
        cart_id: cartId, //dùng để bên trang client liệt kê lại tất cả các đơn hàng đã đặt
        userInfo: userInfo,
        product: products,
    }
    const order = new Order(objectOrder);
    order.save()
    await Cart.updateOne({
        _id:cartId,
    },{
        products:[]
    })
    res.redirect(`/checkout/success/${order.id}`)
}

module.exports.success = async(req, res) =>{
    const orderId = req.params.orderId;
    const order = await Order.findOne({
      _id:req.params.orderId
    });
    for (const product of order.product) {
        let productInfo = await Product.findOne({
            _id:product.product_id
        }).select("title thumbnail")
        product.productInfo = productInfo
        product.priceNew = productHelper.priceNewProduct(product)
        product.totalPrice = product.priceNew * product.quantity
    }
    order.totalPrice = order.product.reduce((sum, item) => sum+item.totalPrice,0)
    res.render("client/page/checkout/success",{
        order:order,
        pageTitle:"Đặt hàng thành công"
    })
}