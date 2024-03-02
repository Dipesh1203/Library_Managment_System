/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("books").del();
  await knex("books").insert([
    {
      bookId: 1,
      title: "Atomic Habit",
      authorName: "James Clear",
      publisher: "ABC",
    },
    {
      bookId: 2,
      title: "48 Laws Of Power",
      authorName: "George",
      publisher: "ABCd",
    },
    {
      bookId: 3,
      title: "Power Of subconcious Mind",
      authorName: "not available",
      publisher: "ABCe",
    },
  ]);
};
