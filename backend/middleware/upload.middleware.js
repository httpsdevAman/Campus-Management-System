import multer from "multer";
import path from "path";
import fs from "fs";

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (req.originalUrl.includes("upload-resource")) {
      cb(null, "uploads/resources/");
    } 
    else if (req.originalUrl.includes("upload-assignment")) {
      cb(null, "uploads/assignments/");
    } 
    else if (req.originalUrl.includes("upload-submission")) {
      cb(null, "uploads/submissions/");
    } 
    else {
      cb(new Error("Invalid upload route"));
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/zip"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and ZIP files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
