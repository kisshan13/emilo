import { requestHandler } from "../../utils/request-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import Settlement from "../../database/schema/settlement.schema.js";
import Post from "../../database/schema/posts.schema.js";

export const controllerSettlementsGet = requestHandler(async (req, res) => {
  const { role, _id: userId } = req.user;
  const {
    page = 1,
    limit = 10,
    sortBy = 'approvedAt',
    sortOrder = 'desc',
    search,
    dateRange,
    startDate: queryStartDate,
    endDate: queryEndDate,
    minApprovedAmount,
    maxApprovedAmount,
    approvedBy,
    userId: queryUserId,
  } = req.query;

  const query = {};

  if (role === "user") {
    query.user = userId;
  } else if (queryUserId) {
    query.user = queryUserId;
  }

  let startDate, endDate;
  if (dateRange) {
    endDate = new Date();
    if (dateRange === 'day') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (dateRange === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }
  } else if (queryStartDate && queryEndDate) {
    startDate = new Date(queryStartDate);
    endDate = new Date(queryEndDate);
  }

  if (startDate && endDate) {
    query.approvedAt = { $gte: startDate, $lte: endDate };
  }

  if (minApprovedAmount || maxApprovedAmount) {
    query.approvedAmount = {};
    if (minApprovedAmount) query.approvedAmount.$gte = parseFloat(minApprovedAmount);
    if (maxApprovedAmount) query.approvedAmount.$lte = parseFloat(maxApprovedAmount);
  }

  if (approvedBy) {
    query.approvedBy = approvedBy;
  }

  if (search) {
    const posts = await Post.find({ caption: { $regex: search, $options: 'i' } }).lean().select('_id');
    const postIds = posts.map(p => p._id);
    query.post = { $in: postIds };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sortBy]: sortOrder },
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'post' },
      { path: 'approvedBy', select: 'name email' },
      { path: 'claim' }
    ],
  };

  const settlements = await Settlement.paginate(query, options);

  return res.status(200).json(new ApiResponse(200, settlements, "Settlements retrieved successfully."));
});
