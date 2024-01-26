const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const bodyparser = require("body-parser");

router.use(express.json());
router.use(bodyparser.json());
router.use(express.urlencoded({ extended: true }));

router.get("/new", (req, res) => {
  res.send("hello");
});

router.post("/", async (req, res) => {
  try {
    const { userName, enrollmentNo, email, dob, issued_books } = req.body;
    const [userId] = await db("users")
      .insert({
        userName: userName,
        enrollmentNo: enrollmentNo,
        email: email,
        dob: dob,
        issued_books: issued_books,
      })
      .returning("userId");
    res.send({ id: userId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
