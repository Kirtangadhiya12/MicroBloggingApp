const mongoose = require("mongoose");
const Joi =require('joi');
const jwt=require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers:[{
      type:ObjectId,
    ref:"User"}],
    following:[{
        type:ObjectId,
      ref:"User"}],
  //  tokens:[{
  //    token:{
  //     type: String,
  //     required: true,
  //    }
  //  }]   
});
// userSchema.methods.generateAuthToken=async (req,res)=>{
//   try{
    
// const token=jwt.sign({
//   _id:this._id},process.env.TOKEN_SECRET);
//   this.tokens=this.tokens.concat({token:token});
//   await this.save();
//   return token;
//   }catch(err)
//   {
//     // res.status(400).json({message:`error is ${err}`});
//     return err;
//   }
// }
module.exports = mongoose.model("User", userSchema);
