const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const db = require("../db/db");

router.get("/new", (req, res) => {
  res.send("hello");
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = db("books").select("*").where({ bookId: id });
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.send(book);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const data = await db("librarian").where({ librarianId: req.user });
    if (!data) {
      return res.send("you can not add books");
    }
    const { title, authorName, publisher } = req.body;
    const [bookId] = await db("books")
      .insert({
        title: title,
        authorName: authorName,
        publisher: publisher,
      })
      .returning("bookId");
    res.send({ id: bookId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//all books
router.get("/all", async (req, res) => {
  try {
    const allBooks = db("books").select("*");
    res.send(allBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
