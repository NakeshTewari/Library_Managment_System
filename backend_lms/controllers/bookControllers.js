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
  const added_by = req.session.user.id;

  const { name, author, isbn, quantity, genre, summary, price, image } =
    req.body;
  const parsedQuantity = parseInt(quantity, 10);
  const availableQuantity = parsedQuantity;

  try {
    await db.execute(
      "INSERT INTO books (name,author,isbn,quantity,available,image,added_by,genre,summary,price) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        name,
        author,
        isbn,
        parsedQuantity,
        availableQuantity,
        image,
        added_by,
        genre,
        summary,
        price,
      ],
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
    await db.execute("DELETE FROM borrowing WHERE book_id = ?", [id]);
    await db.execute("DELETE FROM books WHERE id=?", [id]);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting book: ${error.message}` });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { name, author, isbn, quantity,available, genre, summary, price} = req.body;
  const parsedQuantity = parseInt(quantity, 10);
  const parsedAvailable = parseInt(available, 10);
  const image = req.file ? req.file.filename : null;

  try {
    if (image) {
      await db.execute(
        "UPDATE books SET name=?, author=?, isbn=?, quantity=?,available=?,image=?,genre=?,summary=?,price=? WHERE id=?",
        [name, author, isbn, parsedQuantity, parsedAvailable, image, genre, summary, price, id],
      );
    } else {
      await db.execute(
        "UPDATE books SET name=?, author=?, isbn=?, quantity=?,available=?,genre=?,summary=?,price=? WHERE id=?",
        [name, author, isbn, parsedQuantity, parsedAvailable, genre, summary, price, id],
      );
    }
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const borrowBook = async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.user.id;
  const book_id = id;
  const due_date = req.body.borrowDays; 

  const [rows] = await db.execute(
    "Select * from borrowing where user_id=? and book_id=? and returned_at is null",
    [user_id, book_id],
  );

  if (rows.length > 0) {
    return res.status(400).json({
      message: "You have already borrowed this book, return it first",
    });
  }

  try {
    await db.execute(
      "Insert into borrowing(user_id,book_id, due_date) values (?,?,DATE_ADD(NOW(), INTERVAL ? DAY))",
      [user_id, book_id, due_date],
    );

    await db.execute("update books set available= available-1 where id=?", [
      book_id,
    ]);

    res.status(200).json({ message: "Book borrowed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.user.id;

  const [due_date_rows] = await db.execute(
    "select due_date from borrowing where user_id=? and book_id=? and returned_at is null",
    [user_id, id],
  );
  const due_date = due_date_rows[0].due_date;
  const today = new Date();
  const daysLate = Math.floor((today - due_date) / (1000 * 60 * 60 * 24));
  const fine = daysLate * 5; //5 per day

  try {
    await db.execute(
      "update borrowing set returned_at= current_timestamp, fine=? where book_id=? and user_id=?",
      [fine, id, user_id],
    );
    await db.execute("update books set available= available+1 where id=?", [
      id,
    ]);
    res.status(200).json({ message: "Book returned Successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserBorrowedBooks = async (req, res) => {
  const user_id = req.session.user.id;
  try {
    const [rows] = await db.execute(
      "Select b.id as bookid, b.name, b.author,b.isbn, b.quantity, b.available, b.image,b.genre,b.price,b.summary,b.added_by,br.due_date from books b join borrowing br on b.id=br.book_id where br.user_id=? and returned_at is null",
      [user_id],
    );

    res.status(200).json(rows);

    console.log(rows);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const allBorrowedBooks = async (req, res) => {
  console.log("inside allBorrowedBooks");
  try {
    const [rows] = await db.execute(
      "select u.name as username,b.name as bookname,b.author,b.available, br.borrowed_at,br.due_date,b.genre from borrowing as br join books as b on br.book_id=b.id join users as u on u.id=br.user_id where returned_at is null ",
    );
    console.log("allborrowedbooks", rows);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const countBooksIssued = async (req, res) => {
  const user_id = req.session.user_id;

  try {
    const [rows] = await db.execute(
      "select b.id as bookid, COUNT(br.book_id) as count from books b join borrowing br on b.id=br.book_id group by br.book_id",
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
