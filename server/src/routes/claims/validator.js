import { z } from "zod";

export const claimCreateSchema = z.object({
    postId: z.string().min(1, "Post ID is required")
});

export const deductionSchema = z.object({
    amount: z.number().min(0.01, "Deduction amount must be greater than 0"),
    reason: z.string().min(1, "A reason for the deduction is required"),
});

export const settlementSchema = z.object({
    status: z.enum(["settlement_ok", "settlement_dispute"], {
        required_error: "Settlement status is required",
    }),
});

export const approvalSchema = z.object({
    status: z.enum(["approved", "rejected"], {
        required_error: "Approval status is required",
    }),
});
