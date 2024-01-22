const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Book = require("./models/book");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/bookCollections");
}

main()
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hi welcome to my page Website is under construction");
});

//create route
app.get("/book/new", (req, res) => {
  res.render("Book/book.ejs");
});

//
app.post("/book/", (req, res) => {
  let data = req.params;
  consol;
});

app.listen(8080, (req, res) => {
  console.log("listening to port");
});
