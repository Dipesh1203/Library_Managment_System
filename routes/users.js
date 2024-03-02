const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("../middleware.js");
const knex = require("knex");

router.get("/new", (req, res) => {
  res.send("hello");
});

//signup route
router.post("/signup", async (req, res) => {
  try {
    const { userName, enrollmentNo, email, password, dob, issued_books } =
      req.body;
    if (!(userName && enrollmentNo && email && password && dob)) {
      res.status(400).send("all fields are compulsory");
    }

    const encPass = await bcrypt.hash(password, 10);
    const [userId] = await db("users")
      .insert({
        userName: userName,
        enrollmentNo: enrollmentNo,
        email: email,
        password: encPass,
        dob: dob,
        issued_books: issued_books,
      })
      .returning("userId");

    res.json({ id: userId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("all fields are compulsory");
    }
    const user = await db("users").where({ email: email });

    console.log(user);
    if (user.length === 0) {
      console.log("first register your self");
      res.redirect("/users/signup");
    }
    const exactPass = await bcrypt.compare(password, user[0].password);
    if (user && exactPass) {
      const token = jwt.sign(
        { id: user[0].userId, name: user[0].userName },
        "asdf",
        {
          expiresIn: "3h",
        }
      );
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({ user });
    } else {
      res.send("wrong user and password");
    }
  } catch (error) {
    console.log(error);
  }
});

//add book to user account
router.put("/:bookId", isLoggedIn, async (req, res) => {
  try {
    const { bookId } = req.params;
    const currentIssueBooks = await db("users")
      .where({ userId: req.user.id })
      .select("issued_books");
    const newBooks = { ...currentIssueBooks, bookId };
    const updatedUser = await db("users")
      .where({ userId: req.user.id })
      .update({
        issued_books: newBooks,
      });
    const updatedBook = await db("books")
      .where({ bookId })
      .update({ user_id: req.user.id })
      .returning("*");
    console.log("book added");
    console.log(updatedBook);
    res.send({ updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//destory route
router.delete("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("users")
      .where({ userId: id })
      .del()
      .returning("*");
    console.log(deleted);
    res.send("User Deleted SuccesFully", { deleted });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
