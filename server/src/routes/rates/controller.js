import { requestHandler } from "../../utils/request-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import Rate from "../../database/schema/rates.schema.js";
import { rateSchema } from "./validator.js";

export const controllerGetActiveRate = requestHandler(async (req, res) => {
    const now = new Date();
    const rate = await Rate.findOne({
        effectiveFrom: { $lte: now },
        $or: [{ effectiveTo: { $gte: now } }, { effectiveTo: { $exists: false } }],
    }).sort({ effectiveFrom: -1 });

    if (!rate) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No active rate found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, rate, "Active rate retrieved successfully."));
});

export const controllerRatesCreate = requestHandler(async (req, res) => {
    const { viewsRate, likesRate, effectiveFrom, effectiveTo } = rateSchema.parse(
        req.body
    );

    const newRate = await Rate.create({
        viewsRate,
        likesRate,
        effectiveFrom,
        effectiveTo,
        user: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newRate, "Rate created successfully."));
});

export const controllerRatesUpdate = requestHandler(async (req, res) => {
    const { id } = req.params;
    const { viewsRate, likesRate, effectiveFrom, effectiveTo } = rateSchema.parse(
        req.body
    );

    const updatedRate = await Rate.findByIdAndUpdate(
        id,
        {
            viewsRate,
            likesRate,
            effectiveFrom,
            effectiveTo,
            user: req.user._id,
        },
        { new: true }
    );

    if (!updatedRate) {
        return res.status(404).json(new ApiResponse(404, null, "Rate not found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedRate, "Rate updated successfully."));
});

export const controllerRatesDelete = requestHandler(async (req, res) => {
    const { id } = req.params;

    const deletedRate = await Rate.findByIdAndDelete(id);

    if (!deletedRate) {
        return res.status(404).json(new ApiResponse(404, null, "Rate not found."));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Rate deleted successfully."));
});

export const controllerGetRateHistory = requestHandler(async (req, res) => {
    const now = new Date();
    const rates = await Rate.find({
        $or: [{ effectiveTo: { $lt: now } }, { effectiveTo: { $exists: true, $ne: null } }],
    }).sort({ effectiveFrom: -1 });

    return res.status(200).json(new ApiResponse(200, rates, "Rate history retrieved successfully."));
});

