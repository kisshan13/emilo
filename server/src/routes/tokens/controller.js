import { requestHandler } from "../../utils/request-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { getTokenInfo, signToken } from "../../lib/jwt.js";

export const controllerGetToken = requestHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, { token: signToken(req.user?._id) }))
})