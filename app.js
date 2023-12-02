//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
require('dotenv').config()


const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); //ENCRYPT FIRST, THEN USE DECLARE MODEL
//ONLY encrypt password
const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(() => {
        console.log("Successfully to register a new user");
        res.render("secrets");
    }).catch((err) => {
        console.log(err);
        res.redirect("/register");
    });
    
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password);
    User.findOne({email: username}).then((userFound) => {
        if (userFound) {
            if (userFound.password === password) {
                res.render("secrets");
            }
        }
        console.log(userFound);
        
    }).catch((err) => {
        console.log(err);
    });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});