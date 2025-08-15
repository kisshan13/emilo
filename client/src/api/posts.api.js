import apiClient from "./client"

export const apiCreatePost = (data) => {
    return apiClient.post("/posts", data)
}

export const apiGetPosts = (query) => {
    return apiClient.get(`/posts?${query || ""}`)
}

export const apiGetPostByUser = (userId, query) => {
    return apiClient.get(`/posts/user/${userId}?${query || ""}`)
}

export const apiTogglePostLike = (postId) => {
    return apiClient.get(`/posts/${postId}/toggle-like`)
}

export const apiAddPostView = (data) => {
    return apiClient.post(`/posts/views`, data)
}