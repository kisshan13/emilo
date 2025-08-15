import mongoose from "mongoose";
import database from "../database.js";

const uploadSchema = new mongoose.Schema({
    bucket: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    region: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String
    },
    originalName: {
        type: String,
        required: true
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


const Upload = database.model("Upload", uploadSchema);

export default Upload
