import pg from 'pg';
import dotenv from 'dotenv';

// Destructure the Pool class from the pg library
const { Pool } = pg;

// Create a new connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
//   password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max: 10,                         // Similar to connectionLimit
  idleTimeoutMillis: 30000,       // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000,   // How long to wait for a connection
  allowExitOnIdle: true           // Allow closing idle clients
});

// Optional: Add event listeners for connection management
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Optional: Add a type parser for JSON fields
pg.types.setTypeParser(114, (value: string) => {
  return JSON.parse(value);
});

export default pool;