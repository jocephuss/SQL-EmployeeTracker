const { Pool } = require("pg");

const pool = new Pool({
  // Database connection configuration.
  user: "postgres",
  host: "localhost",
  database: "company",
  password: "dIllsi@h00",
  port: 5432,
});

module.exports = pool; // Export the PostgreSQL pool for use in other files.
