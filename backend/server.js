import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import cookieParser from "cookie-parser";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

// Retain the DNS workaround you were previously using.
dns.setServers(["8.8.8.8"]);

const app = express();
const PORT = 8080;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("SigmaGPT backend is running!");
});

// Authentication APIs
app.use("/api/auth", authRoutes);

// Chat APIs
app.use("/api", chatRoutes);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database");
    } catch (error) {
        console.error("Failed to connect to Database:", error.message);
    }
}

app.listen(PORT, async () => {
    console.log(`SigmaGPT server running on port ${PORT}`);
    await connectDB();
});