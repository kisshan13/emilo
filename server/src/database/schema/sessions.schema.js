import mongoose from "mongoose";
import database from "../database.js";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sessionToken: {
        type: String,
        required: true,
        unique: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Sessions = database.model("Session", sessionSchema)

export default Sessions