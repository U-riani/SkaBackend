// middleware/adminAuth.js
export const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
