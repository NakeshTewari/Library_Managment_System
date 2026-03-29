import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); //file url to path 
const __dirname = path.dirname(__filename); // path to current directory

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: "lms_secret_key",
    resave: false,
    saveUninitialized: false, //dont save empty sessions
    cookie: { secure: false, 
       httpOnly: false, //only brower can send cookie
        maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));  //serve static files from uploads folder

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
