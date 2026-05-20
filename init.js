const mongoose = require("mongoose");
const Chat = require("./models/chats.js");


main()
    .then((res)=>{
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp')
}

let allChats = [
    {
        from : "rose",
        to : "leave",
        msg : "Hello rose! how are you",
        created_at : new Date()
    },
    {
        from : "casely",
        to : "elif",
        msg : "Hello casely! how are you",
        created_at : new Date()
    },
    {
        from : "bob",
        to : "helen",
        msg : "Hello helen,I am bob",
        created_at : new Date()
    },
    {
        from : "neha",
        to : "preeti",
        msg : "Hello! how are you",
        created_at : new Date()
    },
    {
        from : "rohit",
        to : "mohit",
        msg : "What are you doing",
        created_at : new Date()
    },
];

Chat.insertMany(allChats);