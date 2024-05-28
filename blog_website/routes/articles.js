const express=require("express");
const router=express.Router();
const Article=require("../models/article.js")


router.get("/new",(req,res)=>{
    console.log("ksjfskdf");
    res.render("articles/new",{article:new Article()});
    })

    router.get("/edit/:id",async(req,res)=>{
       const article= await Article.findById(req.params.id);
       res.render("articles/edit",{article:article});
        })
        router.get("/edit/:slug",async(req,res)=>{
            const article= await Article.findOne({slug:req.params.slug});
            res.render("articles/edit",{article:article});
             })

    router.get("/:slug",async (req,res)=>{
        console.log("I");
            const article= await Article.findOne({slug:req.params.slug});
            console.log("I");
            console.log(article);
            if(!article) res.redirect("/")
            res.render("articles/show",{article:article})

    })

    router.delete('/:id', async (req, res) => {
        console.log("sldkfjsf");
        await Article.findByIdAndDelete(req.params.id);
        console.log("sfsfdfssss");
        res.redirect('/');
    });



router.post("/",async(req,res,next)=>{
 req.article=new Article();

 next()
 
},saveArticle("new"))

router.put("/:id",async(req,res,next)=>{
    req.article=await Article.findById(req.params.id);
   
    next()
    
   },saveArticle("edit"))

function saveArticle(path){
    return async(req,res)=>{
        let article=req.article
            article.title=req.body.title 
        
            article.description=req.body.description
            article.markdown=req.body.markdown
        
        console.log(article);
        try{
                
               
                article=await article.save();
                console.log(article);
                res.redirect(`/articles/${article.slug}`);
                console.log(article.id);
        }
        catch(e){
            console.log(e);
            res.render(`articles/${path}`,{article:article});
    
        }
    
    }
}


module.exports=router