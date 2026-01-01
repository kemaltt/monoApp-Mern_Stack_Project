const express = require('express');
const router = express.Router();
const checkAdminRole = require('../auth/checkAdminRole');
const { UserDAO } = require('../db-access');
const { getActivityLogs, getUserActivityStats, createActivityLog } = require('../services/activity-log.service');

// Get all users (admin only)
router.get('/admin/users', checkAdminRole, async (req, res) => {
  try {
    const users = await UserDAO.findAll();
    
    // Remove sensitive fields
    const sanitizedUsers = users.map(user => {
      const { password, reset_password_key, reset_passport_key, verification_token, ...safeUser } = user;
      return safeUser;
    });
    
    res.status(200).json({ status: 'success', data: sanitizedUsers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get single user by ID (admin only)
router.get('/admin/users/:id', checkAdminRole, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserDAO.findById(id);
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    // Remove sensitive fields
    const { password, reset_password_key, reset_passport_key, verification_token, ...safeUser } = user;
    
    res.status(200).json({ status: 'success', data: safeUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update user (admin only)
router.put('/admin/users/:id', checkAdminRole, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, license_type, role } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (license_type) updateData.license_type = license_type;
    if (role) updateData.role = role;
    
    const result = await UserDAO.updateUser(id, updateData);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    // Get updated user
    const user = await UserDAO.findById(id);
    const { password, reset_password_key, reset_passport_key, verification_token, ...safeUser } = user;
    
    // Log the update
    await createActivityLog({
      user: id,
      userName: user.name,
      action: 'update',
      resourceType: 'user',
      resourceId: id,
      details: { updatedFields: Object.keys(updateData), adminUpdate: true },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.status(200).json({ status: 'success', message: 'User updated successfully', data: safeUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get all activity logs (admin only)
router.get('/admin/activity-logs', checkAdminRole, async (req, res) => {
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
});

// Get user activity statistics (admin only)
router.get('/admin/activity-logs/stats/:userId', checkAdminRole, async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await getUserActivityStats(userId);
    
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = { adminRouter: router };
