const express = require('express');
const router = express.Router();
const Post = require("../models/post");
const multer=require('multer');
const Like=require('../models/like');
const verifytoken=require('../middleware/verifyToken');
const fs=require('fs');
const { default: mongoose } = require('mongoose');

// image upload
const storage=multer.diskStorage({
    destination:(req,file,callback)=>{callback(null,'uploads')},
    filename:(req,file,callback)=>{callback(null,file.fieldname + "_" + file.originalname)}
  })
  
  const upload=multer({
    storage:storage,
  }).single("image");

  // Insert The Post into database route
  router.post('/add',upload,async(req,res)=>{
     try{ 
         const post= await new Post({
          title: req.body.title,
          description:req.body.description,
          image:req.file.filename
      });
      post.save();
      res.redirect("/");
    }catch(err){
        res.status(400).json({
            message:`the error is ${err}`
        })
    }
  })

// get all posts
router.get('/',async(req,res)=>{

try{
Post.find().exec((err,posts)=>{
    if(err){
        res.json({ message:err.message});
    }else{
        res.render("index",{
            title:"Home Page",
            posts:posts
        });
    }
})}catch(err){
    console.log('the error is:',err);
}
})
router.get('/add',(req,res)=>{
    res.render('add_posts',{title: 'Add Posts'})
})

//edit an post route
router.get('/edit/:id', async(req,res)=>{
   try{ 
       const id=req.params.id;
    Post.findById(id,(err,post)=>{
        if(err){
            res.redirect('/');
        }else{
            if(post == null){
                res.redirect('/');
            }
            else{
                res.render('edit_posts',{title:'Edit Post',post:post});
            }
        }
    })}catch(err){
        console.log('the error is:',err);
    }
})
// update post route
router.post('/update/:id',upload,async(req,res)=>{
    try{
        const id=req.params.id;
    let new_image='';

    if(req.file){
        new_image=req.file.filename;
        try{
            fs.unlinkSync('uploads/'+req.body.old_image);
        }catch(err){
           console.log('the error is:',err);
        }
    }else{
        new_image=req.body.old_image;
    }
    Post.findByIdAndUpdate(id,{
        title:req.body.title,
        description:req.body.description,
        image:new_image
    },(err,result)=>{
        if(err){
            res.status.json({message:`the error is ${err}`})
        }else{
            req.session.message={
                type:'success',
                message:'Post updated successfully!'
            };
            res.redirect('/');
        }
    })}
    catch(err){
        console.log('the error is:',err);
    }
})

// DELETE POST ROUTE
router.get('/delete/:id',async(req,res)=>{
   try{ 
       const id=req.params.id;
    Post.findByIdAndRemove(id,(err,result)=>{
if(result.image!= ''){
    try{
        fs.unlinkSync('uploads/'+result.image);
    }catch(err){
        console.log('the error is:',err);
    }
}
if(err){
    res.status(400).json({
        message:`the error is ${err}`
    })
}else{
    req.session.message={
        type:'info',
        message:'Post deleted successfully!'
    };
    res.redirect('/');
}
    })
}catch(err){
    console.log('the error is:',err);
}
})

//Like route
router.post('/like/:post_id',async(req,res)=>{
   try{ const post_id=req.params.post_id;
    if(!mongoose.Types.ObjectId.isValid(post_id)){
        return res.status(400).send({
            message:'invalid post'
        })
    }
   await Post.findOne({_id:post_id}.then((Post)=>{
       if(!Post){
return res.status(400).send({
    message:'No Post found',
    data:{}
});
       }
       else{
           Like.findOne({
               post_id:post_id
           }).then(async(post_like)=>{
               try{
                if(!post_like){
                    const postLikeDoc=new Like({
                        post_id:post_id
                    });
                   let likeData= await postLikeDoc.save();
                  await Post.updateOne({
                       _id:post_id
                   },{
                       $push:{likes:likeData._id}
                   })
                   return res.status(200).send({
                       message:"like successfully added",
                       data:{}
                   });
                }else{
                 await  Like.deleteOne({
                       _id:post_like._id
                   }) ;
                   await Post.updateOne({
                    _id:post_like.post_id
                },{
                    $pull:{likes:post_like._id}
                })
                return res.status(200).send({
                    message:"like successfully removed",
                    data:{}
                })

               }
         
       }
   catch(err){
    console.log('the error is:',err);
   }

        
}).catch((err)=>{
        return res.status(400).send({
            message:`the error is ${err}` 
    })
    
})}}).catch((err)=>{
        console.log('the error is:',err);
    }

))}catch(err){
    console.log('the error is:',err);
}
})
router.get('/like',(req,res)=>{
    res.redirect('/')
})

module.exports=router;