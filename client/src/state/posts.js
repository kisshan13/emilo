import { proxy } from "valtio";

export const PostState = proxy({
    docs: {},
    userPosts: {},
    userMeta: {page: 1, size: 40},
    meta: { page: 1, size: 40 },
})