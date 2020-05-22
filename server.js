const path = require("path");
// require('dotenv').config({ path: path.resolve(__dirname, './.env') })
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const mysqlConnection = require("./connection");
const app = express();
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const login = require("./routes/index").login;
const isAuthenticated = require("./routes/index").isAuthenticated;
const signup = require("./routes/index").signup;
const createPost = require("./routes/index").createPost;
const getUserPost = require("./routes/index").getUserPost;

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.set("view engine", "ejs");

//template engine
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(cookieParser());
app.use(cors());
app.use(expressLayouts);

//serve static files
app.use(express.static(path.join(__dirname, "/assets")));

app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/login", function (req, res) {
  res.render("login", { layout: "layoutAuth" });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  login({ email, password })
    .then((result) => {
      res.cookie("token", result);
      res.redirect("/");
    })
    .catch((e) => console.log(e));
});

app.get("/signup", function (req, res) {
  res.render("signup", { layout: "layoutAuth" });
});

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  signup({ username, lastname, email, password })
    .then((result) => {
      res.redirect("/");
    })
    .catch((e) => console.log(e));
});

app.get("/", function (req, res) {
  res.render("homepage.ejs");
});

app.get("/aboutus", function (req, res) {
  res.render("aboutus.ejs");
});

app.get("/termsandcondition", function (req, res) {
  res.render("terms_and_condition.ejs");
});

app.get("/events", function (req, res) {
  res.render("events.ejs");
});

app.get("/postad", isAuthenticated, function (req, res) {
  console.log(req.user);
  res.render("postad.ejs", { user: req.user });
});

app.get("/continuePostAd", isAuthenticated, function (req, res) {
  let location_id = req.query.location_id;
  let ad_id = req.query.ad_id;
  let item_category_id = req.query.item_category_id;
  let condition = req.query.condition;
  let method_of_communication = req.query.method_of_communication;
  let method_of_payment = req.query.method_of_payment;
  let negotiable = req.query.negotiable;
  res.render("continuePostAd.ejs", {
    location_id,
    ad_id,
    item_category_id,
    condition,
    method_of_payment,
    method_of_communication,
    negotiable,
  });
});

app.get("/adPreview", isAuthenticated, function (req, res) {
  const {
    location_id,
    ad_id,
    item_category_id,
    title,
    price,
    condition,
    description,
    picture,
    method_of_payment,
    method_of_communication,
    negotiable,
  } = req.query;
  res.render("adPreview.ejs", {
    location_id,
    ad_id,
    item_category_id,
    title,
    price,
    condition,
    description,
    picture,
    method_of_payment,
    method_of_communication,
    negotiable,
  });
});

const aws = require("./uploadPhoto/aws.js");

app.post("/adPreview", isAuthenticated, aws.upload.single("picture"), function (
  req,
  res
) {
  const image = `${process.env.CLOUDFRONT}${req.file.originalname}`;
  const info = {
    ...req.body,
    user_id: req.user.id,
    picture: image,
  };
  console.log(info);
  mysqlConnection.createPost(info, (err, result) => {
    err ? console.log(err) : res.redirect(`/product/${result.insertId}`);
  });
});

// app.get("/selectionPage", isAuthenticated, function (req, res) {
//   getUserPost({ ...req.body, userId: req.user.id })
//     .then((result) => {
//       console.log("this is my result: ", result);
//       res.render("selectionPage.ejs", { user: result });
//     })
//     .catch((e) => console.log(e));
// });

app.get("/selectionPage", isAuthenticated, function (req, res) {
  mysqlConnection.getUserPost(
    { ...req.body, userId: req.user.id },
    (err, rows) => {
      err
        ? console.log(err)
        : res.render("selectionPage", { posts: rows, current_user: req.user });
    }
  );
});

app.post("/selectionPage", isAuthenticated, function (req, res) {
  res.render("selectionPage.ejs", {
    location_id,
    ad_id,
    item_category_id,
    title,
    price,
    condition,
    description,
    picture,
    method_of_payment,
    method_of_communication,
    negotiable,
  });
});

app.get("/myAccount", isAuthenticated, function (req, res) {
  console.log(req.user);
  mysqlConnection.getUserPost(
    { ...req.body, userId: req.user.id },
    (err, rows) => {
      err
        ? console.log(err)
        : res.render("myAccount", {
            posts: rows,
            current_user: req.user,
            user: req.user,
          });
    }
  );
});

app.get("/posts", function (req, res) {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.get("/product/:post_id", function (req, res) {
  const post = req.params.post_id;
  mysqlConnection.getPostDetail(post, (err, rows) => {
    console.log(req.user);
    console.log(rows);
    err
      ? console.log(err)
      : res.render("product", {
          posts: rows[0],
          current_user: req.user,
          user: JSON.parse(rows[0].seller),
        });
  });
});

app.delete("/logout", function (req, res) {
  req.logOut();
  res.redirect("/login");
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
