const UserModel = require('../models/UserModel');
const EmailService = require('../services/email.service');

// Check and send trial expiry reminders
// Should be called by cron job daily
const checkAndSendTrialReminders = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find users with trial license expiring in 7 days or less
    const expiringUsers = await UserModel.find({
      license_type: 'trial',
      status: 'active',
      trial_end_date: { $lte: sevenDaysFromNow, $gt: now }
    });

    let emailsSent = 0;

    for (const user of expiringUsers) {
      const daysUntilExpiry = Math.ceil((user.trial_end_date - now) / (1000 * 60 * 60 * 24));
      const remindersSent = user.trial_reminder_sent || [];

      // Send reminders at 7, 3, and 1 days before expiry
      let shouldSendReminder = false;

      if (daysUntilExpiry <= 7 && remindersSent.length === 0) {
        shouldSendReminder = true; // First reminder (7 days)
      } else if (daysUntilExpiry <= 3 && remindersSent.length === 1) {
        shouldSendReminder = true; // Second reminder (3 days)
      } else if (daysUntilExpiry <= 1 && remindersSent.length === 2) {
        shouldSendReminder = true; // Third reminder (1 day)
      }

      if (shouldSendReminder && remindersSent.length < 3) {
        try {
          await EmailService.sendTrialExpiryReminder({
            name: user.name,
            email: user.email,
            subject: 'Mono App - Your Trial is Expiring Soon',
            currentYear: new Date().getFullYear(),
            daysRemaining: daysUntilExpiry,
            expiryDate: user.trial_end_date.toLocaleDateString()
          });

          // Update reminder sent count
          await UserModel.findByIdAndUpdate(user._id, {
            $push: { trial_reminder_sent: new Date() }
          });

          emailsSent++;
        } catch (emailError) {
          console.error(`Failed to send trial reminder to ${user.email}:`, emailError);
        }
      }
    }

    if (res) {
      res.status(200).json({
        status: 'success',
        message: `Trial reminders checked. ${emailsSent} emails sent.`,
        emailsSent
      });
    }

    return { status: 'success', emailsSent };
  } catch (error) {
    console.error('Error checking trial reminders:', error);
    if (res) {
      res.status(500).json({ status: 'error', message: error.message });
    }
    return { status: 'error', message: error.message };
  }
};

module.exports = { checkAndSendTrialReminders };
