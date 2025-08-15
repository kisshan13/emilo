import { Claims } from "../../database/schema/claim.schema.js";
import { LikedPost, ViewedPost } from "../../database/schema/posts.schema.js";
import { getS3Url } from "../../utils/utils.js";

export async function postWithInteractions({ userId, paginatedResult, withClaims }) {
    const postIds = paginatedResult.docs.map((post) => post._id);

    let likedPosts = [];
    let viewedPosts = [];
    let claims = []

    if (userId) {
        [likedPosts, viewedPosts, claims] = await Promise.all([
            LikedPost.find({
                userId,
                postId: { $in: postIds },
            }).lean(),
            ViewedPost.find({
                userId,
                postId: { $in: postIds },
            }).lean(),
            withClaims ? Claims.find({ creator: userId, post: { $in: postIds } }).select("post").lean() : []
        ]);
    }

    const likedPostIds = new Set(likedPosts.map((lp) => lp.postId.toString()));
    const viewedPostIds = new Set(viewedPosts.map((vp) => vp.postId.toString()));
    const claimPostIds = new Set(claims.map((cp) => cp.post.toString()));

    paginatedResult.docs = paginatedResult.docs.map((post) => ({
        ...post,
        media: post.media.map((media) => getS3Url(media.key)),
        isLiked: likedPostIds.has(post._id.toString()),
        isViewed: viewedPostIds.has(post._id.toString()),
        ...(withClaims ? { claimed: claimPostIds.has(post._id?.toString()) } : {}),
    }));

    return paginatedResult;
}