var express = require('express');
var router = express.Router();

const post = require("../models/postschema");
const user = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(user.authenticate()));

const fs = require("fs");
const path = require("path");
const upload = require("../utils/multer")

const sendmail = require("../utils/email");


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect("/login");
  }
}

router.get('/', async function(req, res, next) {
 const data = await user.find();
 //all post on home page
 const allposts = await post.find().populate("user");
 console.log(allposts);
//  res.send(user);
res.render('index',{user:req.user,allposts:allposts});
});




// 
router.post("/image/:id", isLoggedIn, upload.single("profileimage"), async function (req, res, next) {
  if (req.user.profileimage !== "defaultimage.jpg") {
      fs.unlinkSync(
          path.join(__dirname, "../", "public", "images", req.user.profileimage)
      );
  }
  req.user.profileimage = req.file.filename;
  await req.user.save();
  res.redirect(`/update/${req.params.id}`);
  try {
  } catch (error) {
      res.send(err);
  }
});
// 
router.get('/register', function(req, res, next) {
  res.render('register',{user:req.user});
});

router.post('/register-user', async function(req, res, next) {
try {
  // const data = new user(req.body);
  // await data.save();
  // res.render('profile');
  const {username,name,email,number,password}=req.body;
  await user.register({name,username,number,email},password);
  res.redirect("/login")
} catch (error) {
  console.log(error.message);
}
});

router.get("/login",(req,res)=>{
  res.render("login",{user:req.user})
})

// for alluser 
router.get("/login/:id",async (req,res)=>{
  const log=await user.findById(req.params.id)
  res.render("loginuser",{user:req.user,loged:log})
})
// 

router.post(
  "/signin",
  passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/login",
  }),
  function (req, res, next) {}
);


router.get('/about', function(req, res, next) {
  res.render('about',{user:req.user});
});
router.get('/profile', isLoggedIn, async function(req, res, next) {
  try {
    // const posts = await post.find().populate("user"); // it gives us all posts of all users 
    const posts = await req.user.populate("posts");//it will give us all post of login user;
  res.render('profile',{user:req.user,posts});
  } catch (error) {
    console.log(error);
  }
});

router.get("/log-out",isLoggedIn,(req,res,next)=>{
  req.logout(() => {
    res.redirect("/login");
});
})

router.get("/update/:id",(req,res)=>{
  res.render("update",{user:req.user})
})

router.post("/update-user/:id",async (req,res)=>{
await user.findByIdAndUpdate(req.params.id,req.body);
res.redirect("/profile")
  
})
router.get("/delete-user/:id", async function(req,res){

  const deleted = await user.findByIdAndDelete(req.params.id);
  //delete all posts
  
const userId = req.params.id;
async function deletePostsByUser(userId) {
  const allpost = await post.find({user:userId});
    try {
        const result = await post.deleteMany({ user: userId });
        allpost.forEach((post)=>{
          fs.unlinkSync(path.join(__dirname,"../","public","images", post.media))
        })
    } catch (err) {
        console.error('Error deleting posts: ', err);
    }
}
deletePostsByUser(userId);
 // 

  
  if(deleted.profileimage!=="defaultimage.jpg"){
    fs.unlinkSync(path.join(__dirname,"../","public","images",deleted.profileimage))

  }
  res.redirect("/all-users")

})
//delete post
router.get("/delete-post/:id",isLoggedIn,async function(req,res,next){
 try {
  const deletepost = await post.findByIdAndDelete(req.params.id);
  // console.log(deletepost);
  fs.unlinkSync(path.join(__dirname,"../","public","images", deletepost.media));
  res.redirect("/profile");
 } catch (error) {
  console.log(error);
 }

})

router.get("/reset-password/:id", isLoggedIn, function (req, res, next) {
  res.render("resetpassword", { user: req.user });
});

router.post("/reset-password/:id", isLoggedIn, async function (req, res, next) {
  try {
      await req.user.changePassword(
          req.body.oldpassword,
          req.body.newpassword
      );
      req.user.save();
      res.redirect(`/update/${req.user._id}`)
      // res.redirect("/login")

  } catch (error) {
      res.send(error);
  }
});

router.get("/forgot-email", function(req,res,next){
  res.render("forgot-email",{user:req.user})
})


router.post("/forget-email", async function (req, res, next) {
  try {
      const User = await user.findOne({ email: req.body.email });


      if (User) {
           const url = `${req.protocol}://${req.get("host")}/forget-password/${User._id}`;
          //  sendmail(res,req.body.email,User)          
           sendmail(res,User,url)          
          // res.redirect(`/forget-password/${User._id}`);
      } else {
          res.redirect("/forgot-email");
      }
  } catch (error) {
      res.send(error);
  }
});


router.get("/forget-password/:id", function(req,res,next){
  res.render("forget-password",{user:req.user, id:req.params.id});
} )

router.post("/forgot-password/:id",async function(req,res,next){
  try {
    const User = await user.findById(req.params.id);
    // await User.setPassword(req.body.password);
    // await User.save();
    if (User.resetPasswordToken == 1) {
      await User.setPassword(req.body.password);
      User.resetPasswordToken = 0;
      await User.save();
  } else {
      res.send("Link Expired Try Again!");
  }
    res.redirect("/login");
} catch (error) {
    res.send(error);
}
})
// 

router.get("/all-users",async function(req,res){
 const alluser = await user.find();
 res.render("all-user",{alluser:alluser, user:req.user}) 
})

// 

router.get("/add-post/:id", function(req,res,next){
  res.render("add-post",{user:req.user})
});

router.post("/add-post/:id",isLoggedIn, upload.single("media"), async function(req,res, next){
  try {
    const postdata = new post({
      media:req.file.filename,
      title:req.body.title,
      user:req.user._id
    });
    req.user.posts.push(postdata._id);
    await postdata.save();
    await req.user.save();
    res.redirect("/profile")
  } catch (error) {
    console.log(error);
  }
});

// router.get("/timeline",isLoggedIn, async function(req,res,next){
//   try {
//     res.render("timeline", {user:await req.user.populate("posts")})
//   } catch (error) {
//     res.send(error)
//   }
// })


router.get("/like-post/:postid",isLoggedIn,async function(req,res,next){
  try {
    const Post = await post.findById(req.params.postid);
    // console.log(Post.likes);
    // console.log(req.user.id);

    if(Post.likes.includes(req.user._id)){
      Post.likes=Post.likes.filter((userid)=>{userid != req.user.id})
    }else{
      Post.likes.push(req.user.id);
    }
      
  await Post.save();
  res.redirect("/profile")

  } catch (error) {
    res.send(error.message)
  }
})
//home page like feature
router.get("/like-post/home/:postid",isLoggedIn,async function(req,res,next){
  try {
    const Post = await post.findById(req.params.postid);
    // console.log(Post.likes);
    // console.log(req.user.id);

    if(Post.likes.includes(req.user._id)){
      Post.likes=Post.likes.filter((userid)=>{userid != req.user.id})
    }else{
      Post.likes.push(req.user.id);
    }
      
  await Post.save();
  res.redirect("/")

  } catch (error) {
    res.send(error.message)
  }
})


module.exports = router;
