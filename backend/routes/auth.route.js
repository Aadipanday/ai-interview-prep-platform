import express from "express";

import { registerUserController, loginUserController, logoutUserController, getCurrentUserController } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const authRouter = express.Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authRouter.post("/register", registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */

authRouter.get("/logout", logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged-in user
 * @access Private
 */

authRouter.get("/get-me", authMiddleware, getCurrentUserController);
 

export default authRouter;