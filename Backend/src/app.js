import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import docRoutes from "./routes/document.routes.js"

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
})
)

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/document", docRoutes)

// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
    errors: err.errors || []
  });
});

export default app;