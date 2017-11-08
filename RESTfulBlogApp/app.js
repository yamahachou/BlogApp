
//First thing to create web application is import express,mongoose,body-parser into the application
var express       =require("express");
var app           =express();
var mongoose      =require("mongoose");
var bodyparser    =require("body-parser");
var methodOverride=require("method-override");

//we are going to put three things into MongoDB title:String, image:String, body:String
//first thing need to do is connect to MongoDB
mongoose.connect("mongodb://localhost/restful_blog_app");
//don;t forget to install ejs!!(npm install ejs --save)
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
//these two app.use part still need furthur study, i need to know how they work.
app.use(methodOverride("_method"));//we define methodoveerride as _method, so that we use this way to override the action in edit.ejs

var blogSchema=new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date, default:Date.now }//type should be little t!!
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"http://www.rantsports.com/nba/files/2014/12/Carmelo.jpg",
//     body:"Hello this is a blog setting"
// });

app.get("/",function(req, res) {
   res.redirect("/blogs"); 
});
app.get("/blogs",function(req,res){   //for this part, we are going to create a page which display all blogs
    Blog.find({},function(err,allblogs){
        if(err){
            console.log("Error happened in index part!");
        }
        else{
            res.render("index.ejs",{blogs:allblogs}); 
        }
    });
});
//This NEW ROUTES is going to take us to the form to create the new blog
app.get("/blogs/new",function(req,res){
   res.render("new.ejs");  
});

app.post("/blogs",function(req,res){
   //What we need to do in here is creat blog and redirect it back to /blogs(index) 
   Blog.create(req.body.blog,function(err,newlyCreated){
        if(err){
            res.render("new.ejs");
        }
        else{
            res.redirect("/blogs");
        }
   }); 
});

//SHOW ROUTES, this part is going to show information for specfific ID
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.render("show.ejs",{blog:foundBlog});
       }
    });
});

app.get("/blogs/:id/edit",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.render("edit.ejs",{blog:foundBlog});
       }
    });
});

app.put("/blogs/:id",function(req,res){
     Blog.findByIdAndUpdate(req.params.id, req.body.blog ,function(err,updateblog){
         if(err){
             res.redirect("/blogs");
         }
         else{
             res.redirect("/blogs/" + req.params.id);
         }
     })    
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs/:id");
       } 
       else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server in RESTful app is Listening! "); 
});

