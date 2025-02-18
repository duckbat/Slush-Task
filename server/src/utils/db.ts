import pg from "pg";
const { Pool } = pg;

// Create a new connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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
