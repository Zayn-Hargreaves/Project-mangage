const dashboardRouter = require("./dashboard.router")
const productsRouter = require("./products.router")
const productsCategoryRouter = require("./products-category.router")
const systemConfig = require("../../config/system")
const rolesRouter = require("./roles.router")
const accountsRouter = require("./accounts.router")
const authRouter = require("./auth.router")
const authMiddleware = require("../../middlewares/admin/auth.middleware")
const myAccountRouter = require("../../routers/admin/my-account.router")
const settingsRouter = require("../../routers/admin/settings.router")
module.exports = (app)=>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN+"/dashboard",authMiddleware.requireAuth, dashboardRouter);
    app.use(PATH_ADMIN+"/products", authMiddleware.requireAuth, productsRouter);
    app.use(PATH_ADMIN+"/products-category", authMiddleware.requireAuth,productsCategoryRouter);
    app.use(PATH_ADMIN+"/roles",authMiddleware.requireAuth, rolesRouter);
    app.use(PATH_ADMIN+"/accounts",authMiddleware.requireAuth, accountsRouter);
    app.use(PATH_ADMIN+"/auth", authRouter);
    app.use(PATH_ADMIN+"/my-account", authMiddleware.requireAuth, myAccountRouter)
    app.use(PATH_ADMIN+"/settings",authMiddleware.requireAuth, settingsRouter);
}

