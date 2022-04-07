const mongoose = require("mongoose");
const User = require('../models/user');
const { ObjectId } = mongoose.Schema.Types;
const Joi =require('joi');
const validate=require('validate');
const postSchema = new mongoose.Schema({
  title: {
    type: String,
  required:true
   
  },
  description: {
    type: String,
    required:true
    
    
   
  },
  image:{
    type:String,
    required:true
    
  },
  createdAt:{
type:Date,
required:true,
default: Date.now
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  comments:[{
      text:String,
      default:""
      // postedBy:{type:ObjectId,ref:"User"}
  }],
  postedBy: {
    type: ObjectId,
    ref: "User"
  }
});

// postSchema.path('title').validate({required:true})
// postSchema.path('description').validate({required:true})

module.exports = mongoose.model("Post", postSchema);
