var express = require('express');
var router = express.Router();
var User = require("../models/user")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/register",(req,res)=>{
  var error = req.flash('error')[0]
  res.render("userRegister",{error})
})
router.get("/login",(req,res)=>{
  var error = req.flash('error')[0]
  res.render("userLogin",{error})
})
router.post("/register", (req, res) => {
  var { email, password } = req.body

  if (!email || !password) {
      req.flash("error", "Enter all the fields")
      return res.redirect("/users/register")
  }
  User.create(req.body, (err, user) => {
      console.log(err,user);
      if (err) {
          req.flash("error", err.message)
          return res.redirect("/users/register")
      }
      res.redirect("/users/login")
  })
})
router.post("/login", (req, res) => {
  var { email, password } = req.body

  if (!email || !password) {
      req.flash("error", "Enter all the fields")
      return res.redirect("/users/register")
  }
  User.findOne({email},(err,user)=>{
      if(err) return next(err)

      if (!user) {
          req.flash('error', 'Email not registered');
          return res.redirect("/users/login")
      }
      user.verifyPassword(password,(err,result)=>{
          if(err) return next(err)
          if(!result){
              req.flash("error","Entered wrong password");
              return res.redirect("/users/login")
         }
         req.session.userId = user.id;
          res.redirect("/products")
      })
  })
})

module.exports = router;