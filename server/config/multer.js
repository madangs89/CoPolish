import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

// ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .pdf or .docx
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
});

export default upload;
