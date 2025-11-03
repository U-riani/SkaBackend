import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Multer storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ska_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Create multer instance
const upload = multer({ storage });

// ✅ Add logging middleware for debugging uploads
export const uploadWithLogs = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("❌ Cloudinary Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
        error: err.message,
      });
    }

    if (req.file) {
      console.log("✅ File uploaded to Cloudinary:", req.file.path);
    } else {
      console.warn("⚠️ No file received in request.");
    }

    next();
  });
};

export default upload;
