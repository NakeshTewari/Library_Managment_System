export const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};
