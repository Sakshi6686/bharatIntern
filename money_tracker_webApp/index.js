const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on("connected", () => {
    console.log("connected to mongodb");
});
db.on("error", (error) => {
    console.log("error in connection with mongodb", error);
});

app.post("/add", (req, res) => {
    const category_select = req.body.category_select;
    const info = req.body.info;
    const amount_input = req.body.amount_input;
    const date_input = req.body.date_input;
    const data = {
        "Category": category_select,
        "Amount": amount_input,
        "Info": info,
        "Date": date_input,
    };
    console.log(data);

    db.collection('expenses').insertOne(data, (err, collection) => {
        if (err) {
            console.log("error inserting record:", err);
            return res.status(500).send("Error inserting record");
        }
        console.log("record inserted successfully");
        res.status(200).send("Record inserted successfully");
    });
});

app.get("/expenses", (req, res) => {
    db.collection('expenses').find({}).toArray((err, data) => {
        if (err) {
            console.log("error fetching records:", err);
            return res.status(500).send("Error fetching records");
        }
        res.status(200).json(data);
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    db.collection('expenses').deleteOne({ _id: id }, (err, result) => {
        if (err) {
            console.log("error deleting record:", err);
            return res.status(500).send("Error deleting record");
        }
        console.log("record deleted successfully");
        res.status(200).send("Record deleted successfully");
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-origin": '*'
    });
    return res.redirect("index.html");
});

app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
