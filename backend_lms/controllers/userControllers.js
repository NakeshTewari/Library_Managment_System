import { db } from "../database_connection.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    await db.execute(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, password, role],
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
      "SELECT * FROM users WHERE email=? AND password=?",
      [email, password],
    );
    if (rows.length === 0) {
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
        .json({ message: "Login successful", user: req.session.user });
    });
  } catch (error) {
    return res.status(500).json({ message: `${error.message}` });
  }
};

export const getCurrentUser = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else {
    return res.status(401);
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
