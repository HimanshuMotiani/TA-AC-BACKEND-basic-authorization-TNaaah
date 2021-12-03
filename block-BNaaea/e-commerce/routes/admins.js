var express = require("express")
var router = express.Router()
var Admin = require("../models/admin")

router.get("/register", (req, res) => {
    var error = req.flash('error')[0]
    res.render("adminRegister",{error})
})
router.get("/login", (req, res) => {
    var error = req.flash('error')[0]
    res.render("adminLogin",{error})
})
router.post("/register", (req, res) => {
    var { email, password } = req.body

    if (!email || !password) {
        req.flash("error", "Enter all the fields")
        return res.redirect("/admins/register")
    }
    Admin.create(req.body, (err, admin) => {
        console.log(err,admin);
        if (err) {
            req.flash("error", err.message)
            return res.redirect("/admins/register")
        }
        res.redirect("/admins/login")
    })
})
router.post("/login", (req, res) => {
    var { email, password } = req.body

    if (!email || !password) {
        req.flash("error", "Enter all the fields")
        return res.redirect("/admins/register")
    }
    Admin.findOne({email},(err,admin)=>{
        if(err) return next(err)

        if (!admin) {
            req.flash('error', 'Email not registered');
            return res.redirect("/admins/login")
        }
        admin.verifyPassword(password,(err,result)=>{
            if(err) return next(err)
            if(!result){
                req.flash("error","Entered wrong password");
                return res.redirect("/admins/login")
            }
            req.session.adminId = admin.id;
            res.redirect("/products")
        })
    })
})
module.exports = router;