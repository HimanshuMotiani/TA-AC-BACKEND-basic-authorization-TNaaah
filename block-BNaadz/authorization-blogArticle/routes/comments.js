var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var Article = require("../models/article")
var auth = require("../middlewares/auth")


//edit comment, check logged in user and user who has commented
router.get("/:id/edit", (req, res) => {
    var id = req.params.id
    Comment.findById(id).populate("author").exec((err, comment) => {
        console.log(req.user.id,comment.author.id);
        if (err) return next(err);
        if (comment.author.id == req.user.id) {
            Comment.findById(id, (err, comment) => {
                if (err) return next(err);
                res.render("updateComment", { comment })
            })
        }
        else {
            req.flash("error", "You cannot edit/delete comments of other user")
            return res.redirect("/users/login")
        }
    })
})
router.post("/:id",(req,res)=>{
    var id = req.params.id
    Comment.findByIdAndUpdate(id,req.body,(err,updatedComment)=>{
        if(err) return next(err);
        res.redirect("/articles/"+ updatedComment.articleId)
    })
})
router.get("/:id/delete", (req, res) => {
    var id = req.params.id
    Comment.findById(id).populate("author").exec((err, comment) => {
        console.log(req.user.id, comment.author.id);
        if (err) return next(err);
        if (comment.author.id == req.user.id) {
            Comment.findByIdAndRemove(id, (err, comment) => {
                if (err) return next(err);
                Article.findByIdAndUpdate(comment.ArticleId, { $pull: { comments: comment._id } }, (err, article) => {
                    res.redirect("/articles/" + comment.articleId)
                })

            })
        }
        else {
            req.flash("error", "You cannot edit/delete comments of other user")
            return res.redirect("/users/login")
        }
    })
})

//likes
router.get("/:id/likes",auth.isUserLoggedIn,(req,res)=>{
    var id = req.params.id;
    Comment.findByIdAndUpdate(id,{$inc:{likes:1}},(err,comment)=>{
        if(err) return next(err);
        console.log(err,comment);
        res.redirect("/articles/"+ comment.articleId)
    })
})
module.exports = router