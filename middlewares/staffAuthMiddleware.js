import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";
import Admin from "../models/Admin.js";

export const protectStaff = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🧠 Try both ID types
      const userId = decoded.id || decoded.adminId;

      let user = await Staff.findById(userId).select("-password");

      // Allow admins to access staff routes
      if (!user) {
        user = await Admin.findById(userId).select("-password");
        if (user) req.admin = user;
      } else {
        req.staff = user;
      }

      if (!user) {
        res.status(401);
        throw new Error("Not authorized as staff or admin");
      }

      next();
    } catch (err) {
      console.error("Auth error:", err);
      res.status(401);
      throw new Error("Not authorized as staff or admin");
    }
  } else {
    res.status(401);
    throw new Error("No token provided");
  }
};
