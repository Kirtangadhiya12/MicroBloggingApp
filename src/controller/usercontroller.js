const User=require('../models/user');
const verifyToken=require('../middleware/verifyToken');
const res = require('express/lib/response');


exports.followUser= async (req, res) => {
    try {
         await User.findByIdAndUpdate(req.body.followId,
        {
          $push: { followers:req.user._id},
        },
        {
          new: true
        }
      ),(err,result)=>{
        if(err){
          return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
        },
          {
            new:true
          }
        )
        return res.status(200).json({
          success: true,
          count: like.length,
          data:result
        })
      }
     
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `the error is ${err}`,
      });
    }
  };

  exports.unfollowUser= async (req, res) => {
    try {
         await User.findByIdAndUpdate(req.body.unfollowId,
        {
          $pull: { followers:req.user._id},
        },
        {
          new: true
        }
      ),(err,result)=>{
        if(err){
          return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
        },
          {
            new:true
          }
        )
        return res.status(200).json({
          success: true,
          count: like.length,
          data:result
        })
      }
     
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `the error is ${err}`,
      });
    }
  };

  exports.getregister=function(req,res){
res.render('frontend/register');
  }

  
  exports.getHome=function(req,res){
    res.render('frontend/instatheme');
  }
  exports.getLogin=function(req,res){
      res.render('frontend/login');
  }
  
  