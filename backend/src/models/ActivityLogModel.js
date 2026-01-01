const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["create", "update", "delete", "login", "logout", "register"],
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["transaction", "user", "profile", "auth"],
      required: true,
    },
    resourceId: {
      type: String,
      default: null,
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ resourceType: 1, createdAt: -1 });

const ActivityLogModel = mongoose.model("ActivityLog", activityLogSchema);

module.exports = { ActivityLogModel };
