const express = require("express");
const app = express();
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/horizonExplorers");
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

app.listen(8080, (req, res) => {
  console.log("listening to port");
});
