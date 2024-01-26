const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db.js");

router.post("/staffRegister", async (req, res) => {
  try {
    const { librarianName, email, password } = req.body;
    if (!(librarianName && email && password)) {
      res.status(400).send("all fields are compulsory");
    }

    const encPass = await bcrypt.hash(password, 10);

    const [librarianId] = await db("librarian")
      .insert({
        librarianName,
        email,
        password: encPass,
      })
      .returning("librarianId");
    console.log("Registred SuccesFully");
    res.json({ id: librarianId, librarianName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/staffLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("all fields are compulsory");
    }
    const staff = await db("librarian").where({ email });
    console.log(staff);
    if (!staff) {
      console.log("first register your self");
      return res.redirect("/librarian/staffRegister");
    }
    const exactPass = await bcrypt.compare(password, staff[0].password);
    if (staff && exactPass) {
      const token = jwt.sign({ id: staff.librarianId }, "asdf", {
        expiresIn: "3h",
      });
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({ staff });
    }
  } catch (error) {}
});

// router.put("/issueBook", async (req, res) => {
//   try {
//   } catch (error) {}
// });

module.exports = router;
