const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = 9000;

// const session = require("express-session")
const bodyParser=require('body-parser');
const {check,validationResult}=require('express-validator');
const path=require('path');
const multer=require('multer');
const expressLayouts = require('express-ejs-layouts');
const Home=require('./src/routes/index')
const mongoose = require("mongoose");
const postroute=require('./src/routes/routes');
const User = require("./src/models/user");
const Post = require("./src/models/post");
const PostRoute = require("./src/routes/posts");
const Auth = require("./src/routes/auth");
const jwt = require("jsonwebtoken");
const users=[]
const flash=require('express-flash');
const session=require('express-session');
const verifyToken = require("./src/middleware/verifyToken");
const exp = require("constants");
dotenv.config();
const url = "mongodb://localhost/microBloggingApp";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const con = mongoose.connection;
con.on("open", () => {
  console.log("connected...");
});
app.use(express.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'src/views'));
// app.use(expressLayouts);
app.set('view engine','ejs');
const urlencodedParser=bodyParser.urlencoded({extended:false})

// middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(session({
  secret: "my secret key",
  saveUninitialized: true,
  resave:false
}))

app.use((req,res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})
app.use(express.static("uploads"));
app.use('/',postroute);
app.use(express.static("uploads"));
app.use("/users", Auth);
app.use("/posts", PostRoute);


app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${PORT}`);
});

