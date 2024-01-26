const express = require("express");
const app = express();
const db = require("./db/db.js");
const booksRouter = require("./routes/books.js");
const userRouter = require("./routes/users.js");
const bodyparser = require("body-parser");

app.use(express.json());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/books", booksRouter);
app.use("/user", userRouter);

app.listen(8080, (req, res) => {
  console.log("listening to port");
});
