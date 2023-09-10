const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product");
const { users, products } = require("./seedHelpers");

const mongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Fraxinus");
    console.log("Mongo connected!");
  } catch (err) {
    console.log("Cannot connect to Mongo!");
  }
};
mongo();

const seedDB = async () => {
  console.log(users.length);
  console.log(products.length);
  for (let user of users) {
    const users = new User({
      email: `${user.email}`,
      password: `${user.password}`,
      name: `${user.name}`,
      phone: `${user.phone}`,
      isAdmin: `${user.isAdmin}`,
    });
    await users.save();
  }
  for (let product of products) {
    const products = new Product({
      name: `${product.name}`,
      price: `${product.price}`,
      category: `${product.category}`,
      seller: `${product.seller}`,
      url: `${product.url}`,
      description: `${product.description}`,
    });
    await products.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
