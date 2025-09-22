import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import { Readable } from 'stream';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ url: result.secure_url });
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
