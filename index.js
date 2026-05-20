const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views")); // for adding ejs files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); //for adding css files
app.use(express.urlencoded({extended : true})); // for parsing
app.use(methodOverride("_method"));
main()
    .then((res)=>{
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp')
}

//index route
app.get("/chats", asyncWrap(async(req , res)=> {
    
        let chats = await Chat.find();
        res.render("index.ejs",{chats});
    
}));

//NEW ROUTE
app.get("/chats/new" , (req , res)=> {
    //trying error handling middleware for non asynchronous function
    //throw new ExpressError(404, "Page not found");
    res.render("newChat.ejs");
})

//Create route
app.post("/chats" , asyncWrap(async(req, res, next)=>{
    
        let {from, to, msg } = req.body;
        let addedChat = new Chat({
            from : from,
            msg : msg,
            to : to,
            created_at : new Date(),
        });

        //addedChat.save().then(res => {console.log("chat was saved")}).catch(err => {console.log(err)});
        await newChat.save();

        res.redirect("/chats");
    
    
}));

function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err) => next(err));
    }
};

//New - show route
app.get("/chats/:id", asyncWrap(async(req, res, next)=>{
        let {id} = req.params;
        let chat = await Chat.findById(id);
        //trying error handling middleware for asynchronous function
        if(!chat){
            next( new ExpressError(404, "chat not found"));
        }
        
        res.render("edit.ejs", {chat});
    
}));

//Edit Route
app.get("/chats/:id/edit" , asyncWrap(async (req , res)=>{
   
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
  
}));

//update route
app.put("/chats/:id" , asyncWrap(async (req, res)=>{
    
        let{id} = req.params;
        let {msg : newMsg} = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id , 
            {msg : newMsg}
            ,{runValidators: true, new: true}
        );

        // console.log(updatedChat);
        res.redirect("/chats");
    
}));

//delete route
app.delete("/chats/:id", asyncWrap(async (req, res)=> {
    
        let{id} = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        //console.log(deletedChat);
        res.redirect("/chats");
}));

app.get("/", (req , res)=> {
       res.send("root is working");
});

const handleValidationErr = (err)=>{
    console.log("This was a validation error.Please follow rules");
    console.dir(err);
    return err;
}

app.use((err, req, res, next)=>{
    console.log(err.name);
    if(err.name == "ValidationError"){
       err =  handleValidationErr(err);
    }
    next(err);
});
//error handling middleware
app.use((err, req, res, next)=>{
    let {status = 500, message = "Some error occured"} = err;
    res.status(status).send(message);
})
app.listen(8080 , () => {
    console.log("server is listening on port 8080");
})