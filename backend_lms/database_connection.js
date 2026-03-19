import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import mysql from "mysql2/promise.js";

let db;
try {

  db = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  console.log("Connected to MySQL database");
} catch (error) {
  console.log(`${error.message}`);
}

export { db };
