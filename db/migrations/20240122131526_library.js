const { table } = require("../db");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("userId").primary();
    table.string("userName").notNullable();
    table.string("enrollmentNo").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.date("dob").notNullable();
    table.json("issued_books").defaultTo("[]");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
