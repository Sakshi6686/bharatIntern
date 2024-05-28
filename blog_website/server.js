const express=require("express");
const app=express();
const dotenv=require("dotenv");
dotenv.config();
const mongoose=require("mongoose");
const methodOverride=require("method-override")

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

 
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});


const Article=require("./models/article")
const port=process.env.PORT || 3000;
const articleRouter=require("./routes/articles")
console.log("hi");

app.use(express.urlencoded({extended:false}))
console.log("hiiii");
app.use(methodOverride('_method'));

app.set("view engine","ejs");
console.log("eha");
app.get("/",async(req,res)=>{
     const articles=await Article.find().sort({createdAt:"desc"});
res.render("articles/index",{articles:articles})
})
console.log("la");
app.use("/articles",articleRouter);

app.listen(port,()=>{
    console.log(`server is listening at port ${port}`);
})


