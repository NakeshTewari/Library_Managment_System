import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Test connection on startup
try {
  const conn = await pool.getConnection();
  console.log("Connected to MySQL database");
  conn.release();
} catch (error) {
  console.error("Database connection failed:", error.message);
}

export { pool as db };