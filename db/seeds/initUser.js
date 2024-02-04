/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      userId: 1,
      userName: "Jay1223",
      enrollmentNo: "0801CS221033",
      email: "jay122cs@gmail.com",
      password: "temp1234",
      dob: "2002-12-12",
      issued_books: "[]",
    },
    {
      userId: 2,
      userName: "Jayesh1223",
      enrollmentNo: "0801CS221023",
      email: "jay1222cs@gmail.com",
      password: "temp1234",
      dob: "2002-12-12",
      issued_books: "[]",
    },
    {
      userId: 3,
      userName: "Rahul789",
      enrollmentNo: "0801CS221066",
      email: "rahul789@gmail.com",
      password: "temp1234",
      dob: "2002-12-12",
      issued_books: "[]",
    },
    {
      userId: 4,
      userName: "Rohan6565",
      enrollmentNo: "0801CS221063",
      email: "rohan6565@gmail.com",
      password: "temp1234",
      dob: "2002-12-12",
      issued_books: "[]",
    },
  ]);
};
