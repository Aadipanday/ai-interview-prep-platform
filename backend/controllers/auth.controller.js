import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import TokenBlackList from "../models/tokenBlackList.model.js";

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

export const registerUserController = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    try {
        // Check if the user already exists
        const userAlreadyExists = await User.findOne({
            $or: [{ email }, { name }]
        });

        if (userAlreadyExists) {
            return res.status(400).json({ message: "User with this email or name already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ Id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // BUG FIX: cookie had no options at all, meaning client-side JS
        // could read the auth token via document.cookie — a real XSS
        // exposure risk. httpOnly prevents that.
        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @name loginUserController
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

export const loginUserController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { Id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @name logoutUserController
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */

export const logoutUserController = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        // BUG FIX: this constructed the blacklist document but never saved
        // it — TokenBlackList.save() was never called, so no token was
        // ever actually blacklisted. A logged-out token stayed valid
        // until its natural JWT expiry regardless of logging out.
        const blacklistedToken = new TokenBlackList({ token });
        await blacklistedToken.save();
    }

    res.clearCookie("token");

    return res.status(200).json({ message: "User logged out successfully" });
};


/**
 * @name getCurrentUserController
 * @route GET /api/auth/get-me
 * @desc Get the currently logged-in user
 * @access Private
 */

export const getCurrentUserController = async (req, res) => {
    try {
        const user = await User.findById(req.user.Id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching current user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};