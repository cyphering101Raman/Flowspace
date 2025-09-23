import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import { Readable } from 'stream';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Accept any file type and let Cloudinary detect resource type automatically
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const isImage = (req.file.mimetype || '').startsWith('image/');
    const uploadOptions = {
      folder: 'uploads',
      resource_type: isImage ? 'image' : 'raw',
      type: 'upload',
      access_mode: 'public',
      use_filename: true,
      unique_filename: true,
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          original_filename: result.original_filename,
          type: result.type,
        });
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
