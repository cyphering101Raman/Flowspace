import express from "express";
import cloudinary from "../utils/cloudinary.js"

const route = express.Router();

// Generate signed params for TinyMCE upload
route.post("/signature", (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: "documents" };

  const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUD_API_SECRET);

  res.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUD_API_KEY,
    cloudName: process.env.CLOUD_NAME,
    folder: "workspace-documents",
  });
});

export default route;
