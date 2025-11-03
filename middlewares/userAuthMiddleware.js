import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectUser = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Support both Cookie and Authorization header
    if (req.cookies?.jwt_user) {
      token = req.cookies.jwt_user;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ No token found
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Fetch user (without password)
    req.user = await User.findById(decoded.userId).select("-password");

    // 5️⃣ Handle deleted user (still had cookie)
    if (!req.user) {
      res.status(401);
      throw new Error("User not found or no longer exists");
    }

    next();
  } catch (error) {
    // 6️⃣ Handle token expiration / invalid token
    if (error.name === "TokenExpiredError") {
      res.status(401);
      throw new Error("Session expired, please log in again");
    }

    console.error("Auth error:", error);
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
};
