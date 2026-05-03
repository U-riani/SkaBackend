import jwt from "jsonwebtoken";

const generateToken = (id, type = "user") => {
  const payload = type === "staff" ? { id, role: "staff" } : { id };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken;
