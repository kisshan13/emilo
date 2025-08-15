import mongoose from "mongoose";
import database from "../database.js";
import mongoosePaginate from "mongoose-paginate-v2";

const settlementSchema = new mongoose.Schema({
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Claim",
        required: true,
        index: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    approvedAmount: { type: Number, required: true },
    totalDeduction: { type: Number, required: true },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    approvedAt: { type: Date, default: Date.now },
}, { timestamps: true });

settlementSchema.index({ approvedAt: -1, approvedAmount: -1 });
settlementSchema.index({ creator: 1, approvedAt: -1 });

settlementSchema.plugin(mongoosePaginate);

const Settlement = database.model("Settlement", settlementSchema)

export default Settlement