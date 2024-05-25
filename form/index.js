
const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const bcrypt=require("bcrypt");
const mongoose = require("mongoose");
 

const app = express();
const port = process.env.PORT || 8000;

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    }
});

const User = mongoose.model('User', userSchema);

app.use(express.static(path.join(__dirname, 'pages')));
app.use('/styles', express.static(path.join(__dirname, 'styles'), {
    setHeaders: (res, filepath) => {
        if (path.extname(filepath) === '.css') {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "pages/registration.html"));
})
app.post("/register", async (req, res) => {
    try {
     
        const { fullName, email, password, confirmPassword, age } = req.body;

        if (!fullName || !email || !password || !confirmPassword || !age) {
            return res.redirect("/error");
        }
        if (password !== confirmPassword) {
            return res.redirect("/error");
        }
        
        const existingUser = await User.findOne({ email: email });
   
        if (existingUser) {
            console.log("yeah");
            return res.redirect("/error");
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserDetails = {
            fullName,
            email,
            password: hashedPassword,
            age,


        };

        const newUser = await User.create(newUserDetails);
    
       
        return res.redirect(`/success/${newUser._id}`);
    } catch (err) {
        console.error(err);
        return res.redirect("/error");
    }
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "pages/error.html"));
});

app.get("/success/:userId", async(req, res) => {
  
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("success", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
