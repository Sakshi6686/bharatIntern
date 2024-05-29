
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv=require("dotenv");
const { collection } = require('../blog_website/models/article');
dotenv.config();


const app=express();
const port=process.env.PORT||3000;

app.use(bodyParser.json());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect(process.env.MONGO_URL);
const db=mongoose.connection;
db.on("connected",()=>{
    console.log("connected to mongodb");
})
db.on("error",()=>{
    console.log("error in connection with mongodb",error);
})


app.post("/add",()=>{
    const category_select=req.body.category_select;
    const info=req.body.info;
    const amount_input=req.body.amount_input;
    const date_input=req.body.date_input;
    const data={
        "Category":category_select,
        "Amount":amount_input,
        "info":info,
        "Date":date_input,
    }

    db.collection('users').insertOne(date,(err,collection)=>{
        if(err) throw err;
        console.log("record inserted succesfully");
    })

})

app.get("/",(req,res)=>{

    res.set({
        "Allow-access-Allow-origin":'*'

    })
    return res.redirect("index.html")
})

app.listen(port,()=>{
console.log(`server is running at ${port}`);
})