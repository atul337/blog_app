var express=require("express");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var app=express();
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

//APP CONFIG

//mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser:true});
mongoose.connect("mongodb+srv://atul337:27301616@cluster0-tkzvb.mongodb.net/test?retryWrites=true", {useNewUrlParser:true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer);
app.use(methodOverride("_method"));

//MONGOOSE/MODEL_CONFIG
var blogSchema=new mongoose.Schema({
    title:String,
    image:String, 
    body:String,
    created: {type:Date, default:Date.now}//this will store the time of creation of the data
    
});

var Blog=mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs)
    {
        if(err)console.log(err);
        else res.render("index.ejs", {blogs:blogs});
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    req.body.blog.body=req.sanitized(req.body.blog.body);//sanitize the body of the new blog
    Blog.create(req.body.blog, function(err, newblog){
        if(err)res.render("new");
        else res.redirect("/blogs");
    });
});
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, found){
        if(err)res.redirect("/blogs");
        else res.render("show", {blog:found});
    });
});
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, found){
        if(err)res.redirect("/blogs");
        else res.render("edit", {blog:found});
    });
});
app.put("/blogs/:id", function(req, res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updated){
         if(err)res.redirect("/blogs");
         else res.redirect("/blogs/"+req.params.id);
     });
});
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)res.redirect("/blogs");
        else res.redirect("/blogs");
        
    });
});


//adding the listener
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog App has started");
});