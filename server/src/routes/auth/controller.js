import bcrypt from "bcrypt";
import crypto from "crypto";
import logger from "../../lib/pino.js";

import User from "../../database/schema/user.schema.js";
import Sessions from "../../database/schema/sessions.schema.js";

import { ApiResponse } from "../../utils/api-response.js";
import { requestHandler } from "../../utils/request-handler.js";

import { signupSchema, loginSchema } from "./validator.js"

export const controllerAuthSignup = requestHandler(async (req, res, next) => {
    const { name, email, password } = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res
            .status(409)
            .json(new ApiResponse(400, null, "User with this email already exists."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Sessions.create({
        user: user._id,
        sessionToken,
        ipAddress,
        userAgent,
        expiresAt,
    });

    res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
    });

    logger.info("User created and logged in successfully");
    return res
        .status(201)
        .json(
            new ApiResponse(201, { userId: user._id, role: user.role }, "User created and logged in successfully.")
        );
})

export const controllerAuthLogin = requestHandler(async (req, res, next) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid email or password."));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid email or password."));
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Sessions.create({
        user: user._id,
        sessionToken,
        ipAddress,
        userAgent,
        expiresAt,
    });

    res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
    });


    logger.info("User logged in successfully");
    return res
        .status(200)
        .json(new ApiResponse(200, { userId: user._id, role: user.role }, "Login successful."));
});

export const controllerAuthLogout = requestHandler(async (req, res, next) => {
    const { sessionToken } = req.cookies;

    if (sessionToken) {
        await Sessions.deleteOne({ sessionToken });
    }

    res.clearCookie("sessionToken");
    logger.info("User logged out successfully");
    return res.status(200).json(new ApiResponse(200, null, "Logout successful."));
});
