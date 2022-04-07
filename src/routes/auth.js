const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const{followUser,unfollowUser,getregister,getHome,getLogin}=require('../Controller/usercontroller');

router.use((req, res, next) => {
  console.log(`${req.method}:${req.headers.host}${req.originalUrl}`);
  next();
});

router.put('/follow',verifyToken,followUser);
router.get('/getlogin',getLogin);
router.get('/getHome',getHome);
router.get('/getregister',getregister);
router.put('/unfollow',verifyToken,unfollowUser);

router.get("/protected", verifyToken, (req, res) => {
  res.send(req.user);
});
router.post("/register", async (req, res) => {
  try {
    
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already exists");

   
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

// const token=await user.generateAuthToken();
//     console.log(`the Token is ${token}`);
    const user1 = await user.save();
    // res.status(200).json({data:user1})
    res.redirect('/');
    
    // console.log(user1);

  } catch (err) {
    res.status(400).send(`error is ${err}`);
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email dose not exist");
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid Password");
    res.redirect('/');
    // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    // res.header("auth-token", token).send(token);
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.send(token);
    // const token=await user.generateAuthToken();
    // console.log(`the Token is ${token}`);
    
    console.log("Login Succssfully");

    
  } catch (err) {
    res.status(400).send(`error is ${err}`);
  }
});

// router.put("/follow", verifyToken, async (req, res) => {
//   try {
//        await User.findByIdAndUpdate(req.body.followId,
//       {
//         $push: { followers:req.user._id},
//       },
//       {
//         new: true
//       }
//     ),(err,result)=>{
//       if(err){
//         return res.status(422).json({error:err})
//       }
//       User.findByIdAndUpdate(req.user._id,{
//         $push:{following:req.body.followId}
//       },
//         {
//           new:true
//         }
//       )
//       return res.status(200).json({
//         success: true,
//         count: like.length,
//         data:result
//       })
//     }
   
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: `the error is ${err}`,
//     });
//   }
// });

// router.put("/unfollow", verifyToken, async (req, res) => {
//   try {
//        await User.findByIdAndUpdate(req.body.unfollowId,
//       {
//         $pull: { followers:req.user._id},
//       },
//       {
//         new: true
//       }
//     ),(err,result)=>{
//       if(err){
//         return res.status(422).json({error:err})
//       }
//       User.findByIdAndUpdate(req.user._id,{
//         $pull:{following:req.body.unfollowId}
//       },
//         {
//           new:true
//         }
//       )
//       return res.status(200).json({
//         success: true,
//         count: like.length,
//         data:result
//       })
//     }
   
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: `the error is ${err}`,
//     });
//   }
// });
module.exports = router;
