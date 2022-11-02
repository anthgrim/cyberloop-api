import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./config/connectDb.js";
import corsOptions from "./config/corsOptions.js";
import credentials from "./middlewares/credentials.js";
import * as dotenv from "dotenv";
dotenv.config();

// Initialize PORT and instantiate express application
const PORT = process.env.PORT || 8080;
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Public Routes

// Serve files if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("./public/index.html"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
}

// Initialize app when mongodb connection is open
mongoose.connection.once("open", () => {
  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
  );
});
