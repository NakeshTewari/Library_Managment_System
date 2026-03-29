import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import mysql from "mysql2/promise.js";

let db;
try {

  db = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
  });

  console.log("Connected to MySQL database");
} catch (error) {
  console.log(`${error.message}`);
}

export { db };
