import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import database from "../database.js";

mongoosePaginate.paginate.options = {
    lean: true,
};

const postSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    text: {
        type: String,
        trim: true
    },
    media: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upload"
    }],
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

postSchema.index({ createdAt: -1 });
postSchema.index({ creator: 1, createdAt: -1 });

postSchema.plugin(mongoosePaginate);

const Post = database.model("Post", postSchema);

const likedPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
    }
}, { timestamps: true })

export const LikedPost = database.model("LikedPost", likedPostSchema)

const viewedPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
    }
}, { timestamps: true })

export const ViewedPost = database.model("ViewedPost", viewedPostSchema)

export default Post;