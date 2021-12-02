var express = require('express');
var Article = require("../models/article");
var Comment = require("../models/comment")
var auth = require("../middlewares/auth")
var router = express.Router();

/* GET articles listing. */
router.get('/', function(req, res, next) {
    Article.find({},(err,articlesList)=>{
        if(err) return next(err);
        res.render("articles",{articlesList : articlesList });
    })
});
router.get('/new',auth.isUserLoggedIn ,function(req, res, next) {
    res.render("articleForm");

});
//submit 
router.post('/', function(req, res, next) {
    var { title,description } = req.body;
    console.log(req.user.id);
    req.body.author = req.user.id;
  Article.create(req.body,(err,articleAdd)=>{
      console.log(err,articleAdd)
      res.redirect("/articles")
})
})
// router.get('/:id', function(req, res, next) {
//     var id = req.params.id;
//     Article.findById(id,(err,article)=>{
//         if(err) return next(err);
//         Comment.find({articleId:id},(err,comments)=>{
//             res.render("articlesDetail",{article,comments})
//         })
//   })
// });

// or using populate
// get detail
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    Article.findById(id).populate('comments').exec((err,article)=>{
        if(err) return next(err);
        console.log(article);
            res.render("articlesDetail",{article})
        })
  });
//edit //checking logged in user and author of the article
router.get('/:id/edit', function(req, res, next) {
    var id = req.params.id;
    Article.findById(id).populate("author").exec((err,article)=>{
        if(err) return next(err);
     if(article.author.id == req.user.id){
        Article.findById(id,(err,article)=>{
             if(err) return next(err);       
                    res.render("articleUpdateForm",{article:article})
              })
            }
            else{
                req.flash("error","You cannot edit/delete comments of other user")
                return res.redirect("/users/login")
            }
        });
    })
  
//update 
router.post('/:id', function(req, res, next) {
    var id = req.params.id;
    Article.findByIdAndUpdate(id,req.body,(err,article)=>{
        if(err) return next(err);
        res.redirect("/articles")
  })
});
//delete
router.get("/:id/delete", (req, res) => {
    var id = req.params.id;
    Article.findById(id).populate("author").exec((err, article) => {
        if (err) return next(err);
        if (article.author.id == req.user.id) {
            Article.findByIdAndDelete(id, (err, article) => {
                if (err) return next(err);
                Comment.deleteMany({ articleId: article.id }, (err, comment) => {
                    res.redirect("/articles")
                })
            })
        }
        else {
            req.flash("error", "You cannot edit/delete comments of other user")
            return res.redirect("/users/login")
        }
    })
})

//like
router.get("/:slug/likes",auth.isUserLoggedIn, (req, res) => {
    var slug = req.params.slug
    Article.findOneAndUpdate({slug},{$inc:{likes:1}} ,(err, article) => {
        if (err) return next(err);
        res.redirect("/articles/"+slug)
    })
})

//comments
router.post("/:id/comments",auth.isUserLoggedIn, (req, res) => {
    var id = req.params.id;
    req.body.author = req.user.id;
    req.body.articleId = id;
    Comment.create(req.body,(err,comment)=>{
        if (err) return next(err);
        Article.findByIdAndUpdate(id,{$push:{comments:comment.id}},(err,comment)=>{
            if (err) return next(err);
            console.log(err,comment);  
            res.redirect("/articles/"+ id)
        })
    })
})




module.exports = router;