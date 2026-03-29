import { db } from "../database_connection.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
   
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, role],
    );

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: `${error.message}` });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );
   // 
    if (rows.length === 0 || !await bcrypt.compare(password, rows[0].password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.user = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
    };

    console.log("Logged in user:", req.session.user);
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: "Session save failed" });
      }
      console.log("Session saved:", req.session.user);
      return res
        .status(200)
        .json({ message: "Login successfull.", user: req.session.user });
    });
  } catch (error) {
    return res.status(500).json({ message: `${error.message}` });
  }
};

export const getCurrentUser = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else {
    return res.status(401).json({message:"No current user found!"});
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: `Logout failed ${err.message}` });
    }

    return res
      .clearCookie("connect.sid")
      .status(200)
      .json({ message: "Logout successful" });
  });
};
