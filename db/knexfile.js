// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1", // Your MySQL host address
      user: "root", // Your MySQL username
      password: "Dipesh12@", // Your MySQL password
      database: "library", // Your MySQL database name
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations", // Directory for migration files
    },
    seeds: {
      directory: "./seeds", // Directory for seed files
    },
  },
};
