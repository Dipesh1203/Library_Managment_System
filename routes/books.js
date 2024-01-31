const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const db = require("../db/db");

//show route
// router.get("/", async (req, res) => {
//   const all = await db("books").select("*");
//   console.log(all);
//   res.render("./Books/books.ejs", { all });
// });

//all books
router.get("/all", async (req, res) => {
  try {
    const allBooks = await db("books").select("*");
    console.log(allBooks);
    res.json(allBooks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//search by id
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

//edit route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { title, authorName, publisher } = req.body;
    console.log(req.user);
    const data = await db("librarian").where({ librarianName: req.user.name });
    console.log(data);
    if (data.length === 0) {
      return res.send("You Don't have access to add books");
    }
    // console.log(await db("books").select("*").where({ bookId: id }));
    const updated = await db("books")
      .where({ bookId: id })
      .update({ title: title, authorName: authorName, publisher: publisher })
      .returning("*");
    console.log("Data updated successfully");
    res.send(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error", { error });
  }
});

//delete route
router.delete("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("books")
      .where({ bookId: id })
      .del()
      .returning("*");
    console.log(deleted);
    res.send("User Deleted SuccesFully", { deleted });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const data = await db("librarian").where({ librarianName: req.user.name });
    console.log(data);
    if (data.length === 0) {
      return res.send("You Don't have access to add books");
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

module.exports = router;
