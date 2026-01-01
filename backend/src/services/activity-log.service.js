const { ActivityLogModel } = require("../models/ActivityLogModel");

const createActivityLog = async ({
  user,
  userName,
  action,
  resourceType,
  resourceId = null,
  details = {},
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    const log = new ActivityLogModel({
      user,
      userName,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });
    await log.save();
    return log;
  } catch (error) {
    console.error("Error creating activity log:", error);
    // Don't throw error to avoid breaking the main operation
    return null;
  }
};

const getActivityLogs = async (filters = {}, options = {}) => {
  try {
    const {
      userId,
      action,
      resourceType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = { ...filters, ...options };

    const query = {};

    if (userId) query.user = userId;
    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLogModel.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLogModel.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    throw error;
  }
};

const getUserActivityStats = async (userId) => {
  try {
    const stats = await ActivityLogModel.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);
    return stats;
  } catch (error) {
    console.error("Error fetching user activity stats:", error);
    throw error;
  }
};

module.exports = {
  createActivityLog,
  getActivityLogs,
  getUserActivityStats,
};
