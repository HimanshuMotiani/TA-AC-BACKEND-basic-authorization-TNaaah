var mongoose = require("mongoose");
var slug = require('slug')
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title:{type:String,unique:true},
    description:String,
    author:{type:Schema.Types.ObjectId,ref:"User",required:true},
    likes:{type:Number,default:0},
    comments:[{type:Schema.Types.ObjectId,ref:"Comment"}],
    slug:String
})

articleSchema.pre("save",function(next){
    if (this.title) {
        this.slug = slug(this.title, '_');
        return next()
    }
    else {
        next()
    }
})

var Article = mongoose.model("Article",articleSchema);

module.exports = Article;