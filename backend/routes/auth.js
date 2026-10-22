import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

function createToken(userId) {
    return jwt.sign(
        { userId: userId.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

function setAuthCookie(res, token) {
    res.cookie("sigma_token", token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

// SIGNUP
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            password.length < 8 ||
            password.length > 128
        ) {
            return res.status(400).json({
                message:
                    "Enter your name, email, and a password between 8 and 128 characters.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
        });

        const token = createToken(user._id);

        setAuthCookie(res, token);

        return res.status(201).json({
            message: "Account created successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered.",
            });
        }

        console.error("Signup error:", error.message);

        return res.status(500).json({
            message: "Unable to create account.",
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const token = createToken(user._id);

        setAuthCookie(res, token);

        return res.json({
            message: "Login successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Unable to log in.",
        });
    }
});

// CHECK LOGIN SESSION
router.get("/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("_id name email");

        if (!user) {
            res.clearCookie("sigma_token", cookieOptions);

            return res.status(401).json({
                message: "User account not found.",
            });
        }

        return res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to verify session.",
        });
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    res.clearCookie("sigma_token", cookieOptions);

    return res.json({
        message: "Logged out successfully.",
    });
});

export default router;