const UserModel = require('../models/UserModel');
const { getActivityLogs, getUserActivityStats } = require('../services/activity-log.service');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select('-password -reset_password_key -reset_passport_key -verification_token')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get single user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id)
      .select('-password -reset_password_key -reset_passport_key -verification_token');
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, license_type, role } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (license_type) updateData.license_type = license_type;
    if (role) updateData.role = role;
    
    const user = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -reset_password_key -reset_passport_key -verification_token');
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    res.status(200).json({ status: 'success', message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all activity logs (admin only)
const getAllActivityLogs = async (req, res) => {
  try {
    const {
      userId,
      action,
      resourceType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const filters = {};
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (resourceType) filters.resourceType = resourceType;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await getActivityLogs(filters, options);
    
    res.status(200).json({ 
      status: 'success', 
      data: result.logs,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: parseInt(limit),
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get user activity statistics (admin only)
const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await getUserActivityStats(userId);
    
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, getAllActivityLogs, getUserStats };
