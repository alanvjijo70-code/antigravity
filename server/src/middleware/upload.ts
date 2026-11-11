import multer from 'multer';
import { Request } from 'express';
import { env } from '../config/env.js';

const storage = multer.memoryStorage();

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type (${file.mimetype}). Only JPG, PNG, and WebP plant images are permitted.`
      )
    );
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: env.MAX_IMAGE_SIZE_MB * 1024 * 1024, // 5MB default
  },
  fileFilter,
});
