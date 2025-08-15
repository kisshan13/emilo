import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import database from "../database.js";

const claimSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upload",
    },
    views: { type: Number, required: true },
    likes: { type: Number, required: true },
    expectedEarnings: { type: Number, required: true },
    approvedEarnings: { type: Number },
    status: {
        type: String,
        enum: [
            "pending", // user submitted, waiting for accountant
            "deducted", // accountant applied deduction, waiting for user confirmation
            "settlement_ok", // user accepted deduction
            "settlement_dispute", // user declined deduction, back to accountant
            "accountant_approved",
            "approved", // admin approved
            "rejected", // admin rejected
        ],
        default: "pending",
    },
    rateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rate"
    }
}, {
    timestamps: true
});

claimSchema.plugin(mongoosePaginate);

claimSchema.virtual('deductions', {
    ref: 'ClaimDeduction',
    localField: '_id',
    foreignField: 'claimId'
});

claimSchema.virtual('logs', {
    ref: 'ClaimLogs',
    localField: '_id',
    foreignField: 'claimId'
});

claimSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const claimId = this._id;

    await Promise.all([
        database.model("ClaimDeduction").deleteMany({ claimId }),
        database.model("ClaimLogs").deleteMany({ claimId }),
    ]);

    next();
});

export const Claims = database.model("Claim", claimSchema)

const claimDeductionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    appliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    appliedAt: { type: Date, default: Date.now },
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Claim",
        required: true,
    },
}, { timestamps: true });

export const ClaimDeduction = database.model("ClaimDeduction", claimDeductionSchema)

const claimLogsSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Claim",
        required: true,
    },
    meta: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true })

export const ClaimLogs = database.model("ClaimLogs", claimLogsSchema)
