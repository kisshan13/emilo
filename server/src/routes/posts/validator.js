import { z } from "zod";

export const createPostSchema = z.object({
    text: z.string().optional(),
});

export const postViewSchema = z.object({
    postIds: z.array(z.string())
});
