import { z } from "zod";

export const rateSchema = z.object({
    viewsRate: z.number().positive(),
    likesRate: z.number().positive(),
    effectiveFrom: z.string().datetime(),
    effectiveTo: z.string().datetime().optional(),
});
