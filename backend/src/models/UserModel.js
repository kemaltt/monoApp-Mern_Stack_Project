const mongoose = require('mongoose');


const User = new mongoose.Schema({
  name: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  reset_password_key: {
    type: String
  },
  reset_passport_key: {
    type: String
  },
  passport: {
    type: String
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verification_token: {
    type: String,
    default: null
  },
  verification_token_expires: {
    type: Date,
    default: null
  },
  total_amount: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'passive', 'cancelled', 'deleted'],
    default: 'active'
  },
  license_type: {
    type: String,
    enum: ['trial', 'test_user', 'premium'],
    default: 'trial'
  },
  trial_end_date: {
    type: Date,
    default: null
  },
  trial_reminder_sent: {
    type: Array,
    default: [] // Will store dates when reminders were sent
  },
  lastLogin: {
    type: Date,
    default: null
  },
  profile_image: {
    type: String
  },
},
  {
    timestamps: true
  });

module.exports = mongoose.model('User', User);

