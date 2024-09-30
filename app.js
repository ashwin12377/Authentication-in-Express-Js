const express = require('express');
const app = express();
const path = require('path');

const userModel = require('./models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error } = require('console');
const { JsonWebTokenError } = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    res.render("index")
});

app.post('/create', (req, res) => {
    let { userName, email, password, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {

            let createUser = await userModel.create({
                userName,
                email,
                password: hash,
                age
            });
            let token = jwt.sign({ email }, "secreatKeyshhhhhhh");
            res.cookie("token", token);

            res.send(createUser);
            console.log(hash);
            console.log("Token generated - " + token)
        })
    })
});


// info: check login
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    let user = userModel.findOne({ email: req.body.email });
    if (!user) return res.send("Something went wrong");

    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
            // note: on login the cookies/token should be taken so give the same jwt token here also!
            let token = jwt.sign({ email: user.email }, "secreatKeyshhhhhhh");
            res.cookie("token", token);
            res.send("Your are logiedIn");
        } else {
            res.send("Check the email or password");
        }
    })
})

// info: logout route
app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.render("./");
    console.log("cookie removed from the browser");
})

app.listen(3000, function () {
    console.log("Seerver is running...")
})