import { db } from "../database_connection.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

export const addBook = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized: User not logged in or session invalid.",
    });
  }
  const added_by = req.session.user.id;

  const { name, author, isbn, quantity } = req.body;
  const parsedQuantity = parseInt(quantity, 10);
  const availableQuantity = parsedQuantity;
  const image = req.file ? req.file.filename : null;
  try {
    await db.execute(
      "INSERT INTO books (name,author,isbn,quantity,available,image,added_by) VALUES (?,?,?,?,?,?,?)",
      [name, author, isbn, parsedQuantity, availableQuantity, image, added_by],
    );

    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: `Book not added ${error.message}` });
  }
};

export const getBooks = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM books");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: `Error fetching books: ${error.message}` });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM books WHERE id=?", [id]);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting book: ${error.message}` });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { name, author, isbn, quantity } = req.body;
  const parsedQuantity = parseInt(quantity, 10);
  const image = req.file ? req.file.filename : null;
  const available = parsedQuantity;

  try {
    if (image) {
      await db.execute(
        "UPDATE books SET name=?, author=?, isbn=?, quantity=?, available=?, image=? WHERE id=?",
        [name, author, isbn, parsedQuantity, available, image, id],
      );
    } else {
      await db.execute(
        "UPDATE books SET name=?, author=?, isbn=?, quantity=?, available=? WHERE id=?", // Use parsedQuantity
        [name, author, isbn, parsedQuantity, available, id],
      );
    }
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const borrowBook = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    // Check if the book exists and get its current available quantity
    const [bookRows] = await db.execute(
      "SELECT id, quantity, available FROM books WHERE id = ?",
      [id],
    );

    console.log(bookRows);

    if (bookRows.length === 0) {
      return res.status(404).json({ message: "Book not found." });
    }

    const book = bookRows[0];

    //  Validate available quantity. Ensure it's a number and greater than 0.
    if (typeof book.available !== "number" || book.available <= 0) {
      return res.status(400).json({
        message:
          "Book is currently out of stock or has an invalid available quantity.",
      });
    }

    //  Decrement available quantity
    await db.execute(
      "UPDATE books SET available = available - 1 WHERE id = ?",
      [id],
    );

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
