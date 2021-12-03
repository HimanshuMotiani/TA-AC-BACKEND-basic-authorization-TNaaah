var express = require("express")
var router = express.Router()
var Product = require("../models/product")

//product form
router.get("/new", (req, res) => {
    if(!req.session.adminId){
        req.flash("error","login with admin first")
        return res.redirect("/")
    }
    res.render("addProducts")
})

//add product
router.post("/", (req, res) => {
    Product.create(req.body, (err, product)=>{
    if(err) return next(err);
    res.redirect("/products")
    })
})
// all products
router.get("/", (req, res) => {
    if (req.session.adminId || req.session.userId) {
    Product.find({}, (err, products)=>{
    if(err) return next(err);
    res.render("products",{products})
    })
}
else {
    req.flash('error', 'Login first');
    res.redirect('/');
  }
})
//product details
router.get("/:id", (req, res) => {
    if (req.session.adminId || req.session.userId) {
    var id = req.params.id;
    Product.findById(id, (err, product)=>{
    if(err) return next(err);
    res.render("productDetail",{product})
    })
}
else{
    req.flash('error', 'Login first');
    res.redirect('/');
}
})
//edit product
router.get("/:id/edit", (req, res) => {
    if(!req.session.adminId){
        req.flash("error","login with admin first")
        return res.redirect("/")
    }
    var id = req.params.id;
    Product.findById(id, (err, product)=>{
    if(err) return next(err);
    res.render("editProduct",{product})
    })
})
//update product
router.post("/:id/update", (req, res) => {
    var id = req.params.id;
    Product.findByIdAndUpdate(id,req.body, (err, product)=>{
        console.log(err,product);
    if(err) return next(err);
    res.redirect("/products/" + id)
    })
})
//delete
router.get("/:id/delete", (req, res) => {
    if(!req.session.adminId){
        req.flash("error","login with admin first")
        return res.redirect("/")
    }
    var id = req.params.id;
    Product.findByIdAndDelete(id, (err, product)=>{
    if(err) return next(err);
    res.redirect("/products",)
    })
})
//like
router.get("/:id/likes", (req, res) => {
    if (req.session.adminId || req.session.userId) {
    var id = req.params.id;
    Product.findByIdAndUpdate(id,{$inc:{likes:1}}, (err, product)=>{
        console.log(err,product);
    if(err) return next(err);
    res.redirect("/products/" + id)
    })
}
else{
    req.flash('error', 'Login first');
    res.redirect('/');
}
})
module.exports = router