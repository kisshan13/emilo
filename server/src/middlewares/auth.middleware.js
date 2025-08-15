import Sessions from "../database/schema/sessions.schema.js";
import { ApiResponse } from "../utils/api-response.js";
import { requestHandler } from "../utils/request-handler.js";

export const mAuth = (roles = []) => requestHandler(async (req, res, next) => {
    const { sessionToken } = req.cookies;

    if (!sessionToken) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Unauthorized: No session token provided."));
    }

    const session = await Sessions.findOne({ sessionToken }).populate({
        path: "user",
        select: "-password"
    }).lean();

    if (!session || session.expiresAt < new Date()) {
        if (session) {
            await Sessions.deleteOne({ _id: session._id });
        }
        res.clearCookie("sessionToken");
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Unauthorized: Invalid or expired session."));
    }

    if (!session.user) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Unauthorized: User not found for this session."));
    }

    req.user = session.user;
    req.session = session;

    if (roles.length && !roles.includes(req.user.role)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "missing access"));
    }

    next();
});