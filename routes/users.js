const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// router.use(express.json());
// router.use(bodyparser.json());
// router.use(express.urlencoded({ extended: true }));

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

    const exist = await db("users").where({ email: email });
    // if (!exist) {
    //   res.send("please register your self");
    // }

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
    const exactPass = await bcrypt.compare(password, user.password);
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
  } catch (error) {}
});

module.exports = router;
