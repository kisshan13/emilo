import Sessions from "../database/schema/sessions.schema.js";
import claimLocks from "../io/locks.js";
import { ApiResponse } from "../utils/api-response.js";
import { requestHandler } from "../utils/request-handler.js";

export const mLock = () => requestHandler(async (req, res, next) => {
    const userId = req.user?._id
    const claimId = req.params?.id

    const lock = claimLocks.lock().get(claimId);

    if (lock != userId) {
        return res.status(400).json(new ApiResponse(400, null, "action requires lock"))
    }

    next();
});