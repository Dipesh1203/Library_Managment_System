const db = require("./db/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.token;
  if (!token) {
    res.status(403).send("please login first");
  }
  try {
    const decode = jwt.verify(token, "asdf");
    console.log(decode);
    req.user = decode;
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid");
  }
};

module.exports.isLibrarian = (req, res, next) => {};
