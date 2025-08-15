import { config } from "dotenv";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../src/database/schema/user.schema.js";
import database from "../src/database/database.js";
import logger from "../src/lib/pino.js";

import bcrypt from "bcrypt"

config();

const createAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL;
        if (!email) {
            logger.error("ADMIN_EMAIL not found in .env file");
            process.exit(1);
        }

        const password = crypto.randomBytes(16).toString("hex");
        const user = await User.findOne({ email });

        if (user) {
            user.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
            user.role = "admin";
            await user.save();
            logger.info(`Admin user with email ${email} updated successfully. New password: ${password}`);
        } else {
            await User.create({
                name: "Admin",
                email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
                role: "admin",
            });
            logger.info(`Admin user with email ${email} created successfully. Password: ${password}`);
        }
    } catch (error) {
        logger.error("Error creating or updating admin user:", error);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();
