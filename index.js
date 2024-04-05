const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")
require("dotenv").config();
const database = require("./config/database");

const systemConfig = require("./config/system");
const routerAdmin = require("./routers/admin/index.router")
const router = require("./routers/client/index.router");
database.connect();
const app = express();

const port = process.env.PORT;
app.use(bodyParser.urlencoded({extended:false}))
app.use(methodOverride("_method"))
app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")
//flash
app.use(cookieParser("stsssrttsrt"))
app.use(session({cookie:{maxAge:60000}}));
app.use(flash())

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(express.static(`${__dirname}/public`));

routerAdmin(app);
router(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })
