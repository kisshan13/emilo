import { requestHandler } from "../../utils/request-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import {
    claimCreateSchema,
    deductionSchema,
    settlementSchema,
    approvalSchema,
} from "./validator.js";
import { Claims, ClaimDeduction, ClaimLogs } from "../../database/schema/claim.schema.js";
import Post from "../../database/schema/posts.schema.js";
import Rate from "../../database/schema/rates.schema.js";
import logger from "../../lib/pino.js";
import s3 from "../../lib/aws.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import Config from "../../config.js";
import claimLocks from "../../io/locks.js";
import database from "../../database/database.js";
import Upload from "../../database/schema/upload.schema.js";
import Settlement from "../../database/schema/settlement.schema.js";

const createLog = async (claimId, userId, action, meta = {}) => {
    await ClaimLogs.create({
        claimId,
        user: userId,
        action,
        meta,
    });
    logger.info({ claimId, user: userId, action, meta }, `Claim log created: ${action}`);
};

export const controllerClaimCreate = requestHandler(async (req, res) => {
    const { postId } = req.body;

    if (!req.file) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Media file is required."));
    }

    if (!postId) {
        await s3.send(new DeleteObjectCommand({
            Bucket: Config.AWS_BUCKET,
            Key: req.file.key
        }))

        return res
            .status(400)
            .json(new ApiResponse(400, null, "Post id is required."));
    }

    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        await s3.send(new DeleteObjectCommand({
            Bucket: Config.AWS_BUCKET,
            Key: req.file.key
        }))
        return res.status(400).json(new ApiResponse(400, null, "Post not found."));
    }

    if (post.creator.toString() !== userId.toString()) {
        await s3.send(new DeleteObjectCommand({
            Bucket: Config.AWS_BUCKET,
            Key: req.file.key
        }))
        return res
            .status(400)
            .json(new ApiResponse(400, null, "You are not the owner of this post."));
    }

    const isClaimAlreadyExists = await Claims.findOne({
        post: post._id,
        status: { $ne: "rejected" }
    }).lean()

    if (isClaimAlreadyExists) {
        await s3.send(new DeleteObjectCommand({
            Bucket: Config.AWS_BUCKET,
            Key: req.file.key
        }))
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Already a claim exists for the post."));
    }

    if (post.likes === 0 || post.views === 0) {
        await s3.send(new DeleteObjectCommand({
            Bucket: Config.AWS_BUCKET,
            Key: req.file.key
        }))
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Cannnot create claim for this post"));
    }

    const now = new Date();
    const activeRate = await Rate.findOne({
        effectiveFrom: { $lte: now },
        $or: [{ effectiveTo: { $gte: now } }, { effectiveTo: { $exists: false } }],
    }).sort({ effectiveFrom: -1 });

    if (!activeRate) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No active rate found."));
    }

    const expectedEarnings =
        post.views * activeRate.viewsRate + post.likes * activeRate.likesRate;


    try {
        const newUpload = await Upload.create(

            {
                bucket: Config.AWS_BUCKET,
                key: req.file.key,
                region: Config.AWS_REGION,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                originalName: req.file.originalname,
                uploader: userId,
            },
        );

        const newClaim = await Claims.create({
            creator: userId,
            post: postId,
            views: post?.views,
            likes: post?.likes,
            expectedEarnings,
            rateId: activeRate._id,
            media: newUpload?._id
        });

        await createLog(newClaim._id, userId, "CLAIM_CREATED", {
            views: post?.views,
            likes: post?.likes, expectedEarnings
        });

        return res
            .status(201)
            .json(new ApiResponse(201, newClaim, "Claim created successfully."));
    } catch (error) {
        logger.error(error)

        return res.status(500).json({ message: 'something went wrong' })
    }
});

export const controllerAccountantApplyDeduction = requestHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, reason } = deductionSchema.parse(req.body);
    const accountantId = req.user._id;

    const lock = claimLocks.lock().get(id)

    if (lock != accountantId) {
        return res.status(400).json(new ApiResponse(400, null, "Action requires locking"))
    }

    const claim = await Claims.findById(id);
    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, "Claim not found."));
    }

    if (claim.status !== "pending" && claim.status !== "settlement_dispute" && claim.status !== "settlement_ok") {
        return res.status(400).json(new ApiResponse(400, null, "Claim is not in a state that allows deduction."));
    }

    const deduction = await ClaimDeduction.create({
        claimId: id,
        amount,
        reason,
        appliedBy: accountantId,
    });

    const approvedEarnings = claim.expectedEarnings - ((claim.approvedEarnings || 0) + amount);
    claim.approvedEarnings = approvedEarnings < 0 ? 0 : approvedEarnings;
    claim.status = "deducted";
    await claim.save();

    await createLog(id, accountantId, "DEDUCTION_APPLIED", { amount, reason });

    return res.status(200).json(new ApiResponse(200, { claim, deduction }, "Deduction applied successfully."));
});

export const controllerAccountantApproved = requestHandler(async (req, res) => {
    const { id } = req.params;
    const accountantId = req.user._id;

    const claim = await Claims.findById(id);
    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, "Claim not found."));
    }

    if (claim.status === "pending" || claim.status === "settlement_ok") {
        claim.status = "accountant_approved"
        claim.save()

        const logAction = "ACCOUNTANT_APPROVED"
        await createLog(id, accountantId, logAction);
        return res.status(200).json(new ApiResponse(200, null, "Claim approved"));
    }

    return res.status(400).json(new ApiResponse(400, null, "Claim is not in a state that allows accountant_approve."));
});

export const controllerUserSettleDeduction = requestHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = settlementSchema.parse(req.body);
    const userId = req.user._id;

    const claim = await Claims.findById(id);
    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, "Claim not found."));
    }

    if (claim.creator.toString() !== userId.toString()) {
        return res.status(403).json(new ApiResponse(403, null, "You are not the creator of this claim."));
    }

    if (claim.status !== "deducted") {
        return res.status(400).json(new ApiResponse(400, null, "Claim is not awaiting settlement."));
    }

    claim.status = status;
    await claim.save();

    const logAction = status === "settlement_ok" ? "SETTLEMENT_ACCEPTED" : "SETTLEMENT_DISPUTED";
    await createLog(id, userId, logAction);

    return res.status(200).json(new ApiResponse(200, claim, "Settlement status updated successfully."));
});

export const controllerAdminApproveClaim = requestHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = approvalSchema.parse(req.body);
    const adminId = req.user._id;

    const claim = await Claims.findById(id);
    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, "Claim not found."));
    }

    console.log(claim)
    console.log(claim.status)

    if (claim.status !== "accountant_approved") {
        return res.status(400).json(new ApiResponse(400, null, "Claim is not ready for final approval."));
    }

    claim.status = status;
    claim.approvedEarnings = claim.approvedEarnings || claim.expectedEarnings;
    await claim.save();

    const logAction = status === "approved" ? "CLAIM_APPROVED" : "CLAIM_REJECTED";

    if (logAction == "CLAIM_APPROVED") {

        const deductions = await ClaimDeduction.find({ claimId: claim.id }).lean();

        let totalDeduction = 0;

        deductions?.forEach((deduction) => {
            totalDeduction += deduction.amount
        })

        const settlement = new Settlement({
            approvedAmount: claim.approvedEarnings || claim.expectedEarnings,
            approvedBy: adminId,
            claim: claim._id,
            post: claim.post,
            totalDeduction: totalDeduction,
            user: claim.creator
        })

        await settlement.save();
    }

    await createLog(id, adminId, logAction);

    return res.status(200).json(new ApiResponse(200, claim, "Claim has been processed by admin."));
});

export const controllerGetClaims = requestHandler(async (req, res) => {
    const { role, _id: userId } = req.user;
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        dateRange,
        startDate: queryStartDate,
        endDate: queryEndDate,
        minEarnings,
        maxEarnings,
        minApprovedEarnings,
        maxApprovedEarnings,
        status,
        hasDeduction,
        creatorId,
    } = req.query;

    const query = {};

    if (role === "user") {
        query.creator = userId;
    } else if (role === "accountant") {
        if (!status) {
            query.status = { $in: ["pending", "settlement_dispute", "accountant_approved", "settlement_ok"] };
        }
    }

    if (creatorId && role !== 'user') {
        query.creator = creatorId;
    }

    if (status) {
        query.status = { $in: status.split(',') };
    }

    let startDate, endDate;
    if (dateRange) {
        endDate = new Date();
        if (dateRange === 'day') {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        } else if (dateRange === 'week') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (dateRange === 'month') {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
        }
    } else if (queryStartDate && queryEndDate) {
        startDate = new Date(queryStartDate);
        endDate = new Date(queryEndDate);
    }

    if (startDate && endDate) {
        query.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (minEarnings || maxEarnings) {
        query.expectedEarnings = {};
        if (minEarnings) query.expectedEarnings.$gte = parseFloat(minEarnings);
        if (maxEarnings) query.expectedEarnings.$lte = parseFloat(maxEarnings);
    }

    if (minApprovedEarnings || maxApprovedEarnings) {
        query.approvedEarnings = {};
        if (minApprovedEarnings) query.approvedEarnings.$gte = parseFloat(minApprovedEarnings);
        if (maxApprovedEarnings) query.approvedEarnings.$lte = parseFloat(maxApprovedEarnings);
    }

    if (hasDeduction !== undefined) {
        const claimsWithDeductions = await ClaimDeduction.find().distinct('claimId');
        if (hasDeduction === 'true') {
            query._id = { $in: claimsWithDeductions };
        } else {
            query._id = { $nin: claimsWithDeductions };
        }
    }

    if (search) {
        const posts = await Post.find({ caption: { $regex: search, $options: 'i' } }).lean().select('_id');
        const postIds = posts.map(p => p._id);
        query.post = { $in: postIds };
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: sortOrder },
        populate: [
            { path: 'creator', select: 'name email' },
            { path: 'post' },
            { path: 'deductions', populate: { path: 'appliedBy', select: 'name email' } },
            { path: 'logs', populate: { path: 'user', select: 'name email' } }
        ],
        virtuals: true
    };

    const claims = await Claims.paginate(query, options);

    return res.status(200).json(new ApiResponse(200, claims, "Claims retrieved successfully."));
});

export const controllerGetClaimById = requestHandler(async (req, res) => {
    const { id } = req.params;
    const claim = await Claims.findById(id)
        .populate("creator", "name email")
        .populate("post")
        .populate({
            path: "deductions",
            populate: { path: "appliedBy", select: "name email" },
        })
        .populate({
            path: "logs",
            populate: { path: "user", select: "name email" },
        });

    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, "Claim not found."));
    }

    const { role, _id: userId } = req.user;
    if (role === "user" && claim.creator._id.toString() !== userId.toString()) {
        return res.status(400).json(new ApiResponse(400, null, "Claim not found."));
    }

    return res.status(200).json(new ApiResponse(200, claim, "Claim details retrieved successfully."));
});