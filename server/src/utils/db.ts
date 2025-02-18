import pg from "pg";
require('dotenv').config();
const { Pool } = pg;

// Create a new connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: true,
});

// Add event listeners for connection management
pool.on("connect", () => {
  console.log("Database connection established");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Add a type parser for JSON fields
pg.types.setTypeParser(114, (value: string) => {
  return JSON.parse(value);
});

export default pool;
