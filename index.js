const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");

const mongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Fraxinus");
    console.log("Mongo connected!");
  } catch (err) {
    console.log("Cannot connect to Mongo!");
  }
};
mongo();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.get("/signup", async (req, res) => {
  const allUser = await User.find({});
  const allEmail = [];
  for (user of allUser) allEmail.push(user.email);
  console.log(allEmail);
  res.render("signup", { allEmail });
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", async (req, res) => {
  const { email, password, cpassword } = req.body;
  // form fields are empty conditions
  if (!email || !password || !cpassword) {
    console.log("Email / Password / Cpassword cannot be empty!");
    // form fields submitted conditions
  } else {
    const userEmail = await User.findOne({ email: email });
    const userPassword = await User.findOne({ password: password });
    const userCpassword = await User.findOne({ password: cpassword });
    // password and cpassword already exists conditions
    if (userPassword || userCpassword) {
      console.log("User already exists!");
      // email already exists conditions
    } else if (userEmail) {
      console.log("Email already registered!");
      // password and cpassword are different conditions
    } else if (password !== cpassword) {
      console.log("Password and Confirm Password cannot be different!");
      // make a new user and redirect to signin page
    } else {
      const newUser = new User({
        email: email,
        password: password,
        cpassword: cpassword,
        login: true,
      });
      await newUser.save();
      console.log("Created new user!");
      const findUser = await User.findOne(req.body);
      console.log(findUser);
      res.render("signin", { email });
    }
  }
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/home", async (req, res) => {
  const { email, password } = req.body;
  // form fields are empty conditions
  if (!email || !password) {
    console.log("Email / Password cannot be empty!");
    // form fields submitted conditions
  } else {
    const foundEmail = await User.findOne({ email: email });
    const foundPassword = await User.findOne({ password: password });
    // wrong email or password conditions
    if (!foundEmail || !foundPassword) {
      console.log("Wrong email / password!");
    } else if (password !== foundEmail.password) {
      console.log("Wrong email / password!");
    }
    // correct email and password conditions
    else {
      res.render("home");
    }
  }
});

app.get("/item", (req, res) => {
  res.render("item");
});

app.get("/search", (req, res) => {
  const { search } = req.query;
  res.render("search");
});

app.get("/wishlist", (req, res) => {
  res.render("wishlist");
});

app.get("/user", (req, res) => {
  res.render("user");
});

app.get("/sell", (req, res) => {
  res.render("sell");
});

app.get("/show", (req, res) => {
  res.render("show");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.get("/remove", (req, res) => {
  res.render("remove");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
