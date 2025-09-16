import dotenv from "dotenv";
dotenv.config();

import app from './app.js';
import connectDB from "./lib/db.js";

const PORT = process.env.PORT || 3000;

connectDB()
.then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server Up and Running @${PORT}`);
  })
})
.catch((error)=>{
  console.log(`MongoDB Connection Failed: ${error}`);
})