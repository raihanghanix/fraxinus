const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");

let currUser;
let currUserName;
let currUserEmail;
let currUserPhone;

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
~app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.get("/signup", async (req, res) => {
  currUserName = "";
  currUserEmail = "";
  currUserPhone = "";
  const users = await Product.find({});
  res.render("login/signup", { users });
});

app.post("/signin", async (req, res) => {
  const { name, phone, email, password } = req.body;

  let msg = "";
  if (!name || !phone || !email || !password) {
    msg = "Please fill all the forms!";
    res.render("login/error", { msg });
  } else {
    const foundName = await User.find({ name: name });
    const foundPhone = await User.find({ phone: phone });
    const foundEmail = await User.find({ email: email });
    if (foundName.length > 0) {
      msg = "Name / Phone Number / Email already exists!";
      res.render("login/error", { msg });
    } else if (foundPhone.length > 0) {
      msg = "Name / Phone Number / Email already exists!";
      res.render("login/error", { msg });
    } else if (foundEmail.length > 0) {
      msg = "Name / Phone Number / Email already exists!";
      res.render("login/error", { msg });
    } else if (password.length <= 6) {
      msg = "Password to short!";
      res.render("login/error", { msg });
    } else {
      const newUser = new User({
        name: name,
        phone: phone,
        email: email,
        password: password,
      });
      await newUser.save();
      console.log("Created new user!");
      res.render("login/signin");
    }
  }
});

app.get("/signin", (req, res) => {
  res.render("login/signin");
});

app.post("/home", async (req, res) => {
  const { email, password } = req.body;
  const products = await Product.find({});
  const findUser = await User.findOne({ email: email });
  if (!email || !password) {
    currUserName = "";
    currUserEmail = "";
    currUserPhone = "";
    msg = "Email / Password cannot be empty!";
    res.render("login/error", { msg });
  } else {
    currUserName = findUser.name;
    currUserEmail = findUser.email;
    currUserPhone = findUser.phone;
    let msg = "";
    if (!email || !password) {
      msg = "Email / Password cannot be empty!";
      res.render("login/error", { msg });
    } else {
      const foundEmail = await User.findOne({ email: email });
      const foundPassword = await User.findOne({ password: password });
      if (!foundEmail || !foundPassword) {
        msg = "Wrong email / password!";
        res.render("login/error", { msg });
      } else if (password !== foundEmail.password) {
        msg = "Wrong email / password!";
        res.render("login/error", { msg });
      } else {
        console.log();
        res.render("home/home", {
          products,
          currUser,
          currUserName,
          currUserEmail,
          currUserPhone,
        });
      }
    }
  }
});

app.get("/home", async (req, res) => {
  const products = await Product.find({});
  res.render("home/home", { products });
});

app.get("/show/", (req, res) => {
  res.render("show");
});

app.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("home/show", { product });
});

app.get("/show/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("home/edit", { product });
});

app.put("/show/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, {
    ...req.body,
  });
  res.redirect(`/show/${product._id}`);
});

app.get("/new", (req, res) => {
  res.render("home/new");
});

app.post("/newproduct", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.redirect("home");
});

app.delete("/show/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/home");
});

app.get("/search", async (req, res) => {
  const { q } = req.query;
  const param = req.query;
  const products = await Product.find({ category: q });
  res.render("home/search", { products, q });
});

app.get("/search/s", async (req, res) => {
  const { search } = req.query;
  const products = await Product.find({});
  res.render("home/searchnav", { products, search });
});

app.get("/wishlist", (req, res) => {
  res.render("home/wishlist");
});

app.get("/user", async (req, res) => {
  const name = currUserName;
  const email = currUserEmail;
  const phone = currUserPhone;
  res.render("home/user", { name, email, phone });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
