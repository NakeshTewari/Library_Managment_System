import express from "express";
import { isAdmin, isLoggedIn } from "../controllers/authMiddleware.js";
import { addBook, upload } from "../controllers/bookControllers.js";
import { getBooks } from "../controllers/bookControllers.js";
import { deleteBook } from "../controllers/bookControllers.js";
import { updateBook } from "../controllers/bookControllers.js";
import { borrowBook } from "../controllers/bookControllers.js";

const router = express.Router();

router.post("/addBook", isLoggedIn, isAdmin, upload.single("image"), addBook);
router.get("/getBooks", getBooks);
router.delete("/deleteBook/:id", isLoggedIn, isAdmin, deleteBook);
router.put("/updateBook/:id", isLoggedIn, isAdmin, upload.single("image"), updateBook);
router.post("/borrowBook/:id", isLoggedIn, borrowBook);
export default router;
