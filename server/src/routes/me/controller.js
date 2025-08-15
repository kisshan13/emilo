import User from "../../database/schema/user.schema.js";
import { ApiResponse } from "../../utils/api-response.js";
import { requestHandler } from "../../utils/request-handler.js"

export const controllerGetMe = requestHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("email name role _id").lean()

    return res.status(200).json(new ApiResponse(200, user, ""))
})
