const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  gener: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
