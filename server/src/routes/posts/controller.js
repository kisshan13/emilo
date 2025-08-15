import Config from "../../config.js";

import database from "../../database/database.js";
import Post, {
    LikedPost,
    ViewedPost,
} from "../../database/schema/posts.schema.js";
import Upload from "../../database/schema/upload.schema.js";

import { requestHandler } from "../../utils/request-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { getS3Url, getBaseQuery } from "../../utils/utils.js";
import { postViewSchema } from "./validator.js";
import { postWithInteractions } from "./utils.js";

export const controllerPostCreate = requestHandler(async (req, res) => {
    const { text } = req.body;
    const creator = req.user._id;

    if (!req.file) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Media file is required."));
    }

    const session = await database.startSession();
    session.startTransaction();

    try {
        const newUpload = await Upload.create(
            [
                {
                    bucket: Config.AWS_BUCKET,
                    key: req.file.key,
                    region: Config.AWS_REGION,
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype,
                    originalName: req.file.originalname,
                    uploader: creator,
                },
            ],
            { session }
        );

        const newPost = await Post.create(
            [
                {
                    creator,
                    text,
                    media: [newUpload[0]._id],
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res
            .status(201)
            .json(new ApiResponse(201, newPost[0], "Post created successfully."));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

export const controllerPostGet = requestHandler(async (req, res) => {
    const { page, limit } = getBaseQuery(req.query);
    const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
            { path: "creator", select: "name" },
            { path: "media", select: "bucket key region" },
        ],
    };

    const userId = req.user?._id;

    const result = await Post.paginate({}, options);

    const finalresult = await postWithInteractions({ userId, paginatedResult: result })

    return res
        .status(200)
        .json(new ApiResponse(200, finalresult, "Posts retrieved successfully."));
});

export const controllerGetUserPosts = requestHandler(async (req, res) => {
    const { userId } = req.params;
    const { page, limit } = getBaseQuery(req.query);
    const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
            { path: "creator", select: "name" },
            { path: "media", select: "bucket key region" },
        ],
    };

    const result = await Post.paginate({ creator: userId }, options);

    const finalResult = await postWithInteractions({ userId, paginatedResult: result, withClaims: userId == req.user?._id })

    return res
        .status(200)
        .json(new ApiResponse(200, finalResult, "User posts retrieved successfully."));
});

export const controllerToggleLike = requestHandler(async (req, res, next) => {
    const { id } = req.params;

    const isAlreadyLiked = await LikedPost.findOne({
        postId: id,
        userId: req.user?._id,
    }).lean();

    console.log(req.user);

    console.log(`Is Liked ${!!isAlreadyLiked}`);

    const session = await database.startSession();
    session.startTransaction();
    try {
        if (isAlreadyLiked) {
            await Post.updateOne(
                { _id: id },
                { $inc: { likes: -1 } },
                { session }
            ).lean();
            await LikedPost.deleteOne({ _id: isAlreadyLiked._id }, { session });

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json(new ApiResponse(200, "Post disliked."));
        } else {
            await Post.updateOne(
                { _id: id },
                { $inc: { likes: 1 } },
                { session }
            ).lean();
            await LikedPost.create([{ postId: id, userId: req.user?._id }], {
                session,
            });

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json(new ApiResponse(200, "Post liked."));
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
});

export const controllerAddPostViews = requestHandler(async (req, res, next) => {
    const { postIds } = postViewSchema.parse(req.body);
    const userId = req.user?._id;

    if (!postIds || postIds.length === 0) {
        return res.status(400).json(new ApiResponse(400, "No post IDs provided."));
    }

    const session = await database.startSession();
    session.startTransaction();

    try {
        const existingViews = await ViewedPost.find(
            {
                userId,
                postId: { $in: postIds },
            },
            { postId: 1 }
        ).lean();

        const alreadyViewedIds = new Set(
            existingViews.map((v) => v.postId.toString())
        );
        const newViewIds = postIds.filter(
            (id) => !alreadyViewedIds.has(id.toString())
        );

        const newViews = newViewIds.map((postId) => ({ userId, postId }));
        if (newViews.length > 0) {
            await ViewedPost.insertMany(newViews, { session });

            await Post.updateMany(
                { _id: { $in: newViewIds } },
                { $inc: { views: 1 } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(new ApiResponse(200, "Post views updated."));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
});

// export const 