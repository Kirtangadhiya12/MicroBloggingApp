const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const userAuth=require('../routes/auth');
const filestore = require("session-file-store")(session);
const path = require("path")
const auth = (req, res, next) => {
 
      
        try {
          const bearerHeader = req.headers['authorization'];
          console.log("======> :: bearerHeader", bearerHeader);
          if (typeof bearerHeader !== 'undefined') {
              const bearerToken = bearerHeader.split(' ')[1];
              req.token = bearerToken;
              console.log("======> :: req.token", req.token);
              
          
          jwt.verify(req.token, process.env.TOKEN_SECRET, (error,payload) => {
              if (error) 
              
              {
                  res.status(400).send("not logged in")
              }
              const { _id } = payload;
                User.findById(_id).then((userdata) => {
                  req.user = userdata;
                 return  next();
                });
          })
      }
     } catch (error) {
          res.send(error)
      }
    }
    
  
    // console.log("AHEKEKKKKK " ,req.headers.authorization)
    // const token = req.headers.authorization.split(" ")[1];
    
    // //Authorization: 'Bearer TOKEN'
    // if (!token) {
    //   res.status(200).json("Token was not provided");
    // }
    // //Decoding the token
    // jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    //   if (err) {
    //     res.status(401).json({ error: "you must be logged in" });
    //   }
    //   const { _id } = payload;
    //   User.findById(_id).then((userdata) => {
    //     req.user = userdata;
    //    return  next();
    //   });
    // });  
//   } catch (error) {
//     console.log("AUTH error ",error)
//   }
//   //   req.user = decodedToken;
// };

module.exports = auth;
