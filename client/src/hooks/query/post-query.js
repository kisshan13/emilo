import { apiCreatePost, apiGetPosts, apiGetPostByUser, apiTogglePostLike, apiAddPostView } from "@/api/posts.api";
import { useWrappedMutation } from "@/query-provider";
import { useQuery } from "@tanstack/react-query";

/**
 * @param {import("@/types").OmittedMutationFunction}
 */
export const useMCreatePost = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["posts"]
    }, async (data) => {
        return apiCreatePost(data);
    });
};

/**
 * @param {import("@/types").OmittedMutationFunction}
 */
export const useMPostLikeToggle = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["posts"]
    }, async (data) => {
        return apiTogglePostLike(data?.postId);
    });
};

/**
 * @param {import("@/types").OmittedMutationFunction}
 */
export const useMPostView = (options) => {
    return useWrappedMutation({
        ...options,
        mutationKey: ["posts"]
    }, async (data) => {
        return apiAddPostView(data);
    });
};

/**
 * @param {object} query - query parameters as a string or object
 */
export const useGetPostsQuery = (query) => {
    return useQuery({
        queryKey: ["posts", query],
        queryFn: async () => (await apiGetPosts(query))?.data?.data,
    });
};

/**
 * @param {string | number} userId - ID of the user whose posts to fetch
 */
export const useGetPostByUserQuery = (userId, query) => {
    return useQuery({
        queryKey: ["posts", "user", userId, query],
        queryFn: async ({ queryKey }) => (await apiGetPostByUser(queryKey[2], queryKey[3]))?.data?.data,
        enabled: !!userId, // only fetch if userId is provided
    });
};
