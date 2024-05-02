var express = require('express');
var router = express.Router();

const userModel = require("../models/user")

/* GET home page. */
router.get('/', async function(req, res, next) {
 const user = await userModel.find();
 res.send(user);

  res.render('index');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.post('/register-user', async function(req, res, next) {
try {
  const user = new userModel(req.body);
  await user.save();
  res.redirect("/");
} catch (error) {
  console.log(error.message);
}
});
router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
