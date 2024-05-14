var express = require('express');
var router = express.Router();

const user = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(user.authenticate()));


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect("/login");
  }
}

router.get('/', async function(req, res, next) {
 const data = await user.find();
//  res.send(user);
res.render('index',{user:req.user});
});


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
  res.render('profile',{user:req.user});
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
      res.redirect(`/update-user/${req.user._id}`)
  } catch (error) {
      res.send(error);
  }
});

router.get("/forgot-email", function(req,res,next){
  res.render("forgot-email",{user:req.user})
})



// router.get("/forgotpassword/:id", function(req,res,next){
//   res.render("forgotpassword",{user:req.user,id:req.params.id});
// } )



module.exports = router;
