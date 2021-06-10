//jshint esversion:6
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true,useUnifiedTopology: true});

const wikiSchema = new mongoose.Schema({
    title : String,
    content : String
});
const Article = mongoose.model("Article",wikiSchema);

/////////////////////////////// request targeting for all articles  ///////////////////
app.route("/article")
.get(function(req,res){
    Article.find(function(err,docs){
                    if(!err){
                        res.send(docs);
                    }else{
                        console.log(err);
                    }
                });
            })
    .post(function(req,res){
            const newArticle = new Article({
                title : req.body.title,
                content : req.body.content
            });
            newArticle.save(function(err,docs){
                if(!err){
                    // res.send("You logged success fully ");
                    res.send(docs);
                }else{
                    console.log(err);
                }
            });
        })
    .delete(function(req,res){
            Article.deleteMany(function (err) {
                if (!err) {
                    res.send("Successfully deleted");
                }else{
                    console.log(err);
                }
                
              });
        });

/////////////////////////////// request targeting for specific  articles///////////////////

app.route("/article/:titleName")
    .get(function(req,res){
        const titleName= req.params.titleName;
        Article.findOne({title : titleName},function(err,docs){
            if(docs){
                res.send(docs);
            }else{
                res.send("No article found ");
            }
        });
    })
    .put(function(req,res){
        Article.updateOne({title:req.params.titleName},
            {title:req.body.title , content:req.body.content},
            function(err){
                if(!err){
                    res.send("successfully update document");
                }else{
                    console.log(err);
                }
            });
    })
    .patch(function(req,res){
        Article.updateOne(
            {title:req.params.titleName},
            {$set:req.body},
            function(err){
                if(!err){
                    res.send("successfully updated the specific data");
                }else{
                    console.log(err);
                }
            });
    })
    .delete(function(req,res){
        Article.deleteOne({title:req.params.titleName},
            function(err){
                if(!err){
                    res.send("successfully deleted");
                }else{
                    console.log(err);
                }
            });
    })
    ;



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
