const express = require("express");
const path = require('path')
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
const moment = require("moment")
database.connect();
const app = express();
const port = process.env.PORT;
const http = require("http")
const {Server }= require("socket.io")
app.use(bodyParser.urlencoded({extended:false}))
app.use(methodOverride("_method"))
app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")


//flash
app.use(cookieParser("stsssrttsrt"))
app.use(session({cookie:{maxAge:60000}}));
app.use(flash())

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
app.use(express.static(`${__dirname}/public`));


//tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//end tinymce

//socketIO
const server = http.createServer(app)
const io = new Server(server)
global._io = io
io.on("connection", (socket) =>{
  console.log("a user connected", socket.id)
})


//end socketIO
routerAdmin(app);
router(app);

app.get("*", (req,res)=>{
  res.render("client/page/error/404",{
    pageTitle:"404 Not found"
  })
})
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })
