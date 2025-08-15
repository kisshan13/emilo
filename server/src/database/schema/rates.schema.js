import mongoose from "mongoose";
import database from "../database.js"

const rateSchema = new mongoose.Schema({
    viewsRate: { type: Number, required: true },
    likesRate: { type: Number, required: true },
    effectiveFrom: { type: Date, required: true, index: true },
    effectiveTo: { type: Date, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const Rate = database.model("Rate", rateSchema)

export default Rate
