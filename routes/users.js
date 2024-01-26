const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("../middleware.js");

router.get("/new", (req, res) => {
  res.send("hello");
});

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("all fields are compulsory");
    }
    const user = await db("users").where({ email: email });
    if (!user) {
      console.log("first register your self");
      res.redirect("/users/signup");
    }
    const exactPass = await bcrypt.compare(password, user[0].password);
    if (user && exactPass) {
      const token = jwt.sign({ id: user.userId }, "asdf", {
        expiresIn: "3h",
      });
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({ user });
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
      .where({ userId: req.user })
      .select("issued_Books");
    const newBooks = [...currentIssueBooks, bookId];
    await db("users").where({ userId: req.user }).update({
      issued_books: newBooks,
    });
    const userData = await db("users").select("*").where({ userId: req.user });
    console.log("book added");
    res.send({ userData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
