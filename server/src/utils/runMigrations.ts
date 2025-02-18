import { readFileSync } from "fs";
import { join } from "path";
import pool from "./db";

const runMigrations = async () => {
  try {
    const sqlFile = readFileSync(
      join(__dirname, "../../../db/Slush-db.sql"),
      "utf-8"
    );

    console.log("Starting database migrations...");

    await pool.query(sqlFile);

    console.log("Migrations completed successfully!");

    await pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

runMigrations();
