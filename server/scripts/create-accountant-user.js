import { config } from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../src/database/schema/user.schema.js";
import database from "../src/database/database.js";
import logger from "../src/lib/pino.js";

config();

const createAccountant = async () => {
    try {
        const email = process.env.ACCOUNTANT_EMAIL;
        if (!email) {
            logger.error("ACCOUNTANT_EMAIL not found in .env file");
            process.exit(1);
        }

        const password = crypto.randomBytes(16).toString("hex");
        const user = await User.findOne({ email });

        if (user) {
            user.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
            user.role = "accountant";
            await user.save();
            logger.info(`Accountant user with email ${email} updated successfully. New password: ${password}`);
        } else {
            await User.create({
                name: "Accountant",
                email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
                role: "accountant",
            });
            logger.info(`Accountant user with email ${email} created successfully. Password: ${password}`);
        }
    } catch (error) {
        console.log(error)
        logger.error("Error creating or updating accountant user:", error);
    } finally {
        mongoose.disconnect();
    }
};

createAccountant();
