const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const EmailService = require('../services/email.service');
const { UserDAO } = require('../db-access');
const { createRandomHash, hash } = require('../utils/hash');

const forgotPassport = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: 'Please provide email' });
    const foundUser = await UserDAO.findByEmail(email);
    // const user = await UserModel.findOne({ email });
    if (!foundUser) return res.status(400).json({ message: 'User not found' });

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    await UserDAO.findByIdAndUpdate(foundUser._id, { reset_passport_key: token });
    const resetURL = `${process.env.API_PATH === 'production' ? process.env.CLIENT_URL : process.env.CLIENT_LOCAL_URL}/reset-passport?reset_passport_key=${token}`;
    const options = {
      name: foundUser.name,
      email: foundUser.email,
      subject: 'Mono App [Reset your passport] ',
      currentYear: new Date().getFullYear(),
      resetURL,
    };

    // reuse existing email template for resets
    await EmailService.sendForgotPasswordEmail(options);

    res.status(200).json({ status: 'success', message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const resetPassport = async (req, res) => {
  const { reset_passport_key } = req.params;
  const { passport } = req.body;
  try {
    if (!reset_passport_key || !passport) return res.status(400).json({ message: 'Please provide all fields' });
    // const user = await UserModel.findOne({ reset_passport_key });
    const foundUser = await UserDAO.findByResetPassportKey(reset_passport_key);
    if (!foundUser) return res.status(400).json({ message: 'Invalid user' });

    const decoded = jwt.verify(reset_passport_key, process.env.JWT_SECRET);
    if (foundUser._id.toString() !== decoded.id) return res.status(400).json({ message: 'Invalid token' });

    const passwordSalt = createRandomHash();
    const passwordHash = hash(passport + "" + passwordSalt);
    // Update passport and clear key
    await UserDAO.findByIdAndUpdate(foundUser._id, { passwordHash: passwordHash, passwordSalt: passwordSalt, reset_passport_key: null });

    res.status(200).json({ status: 'success', message: 'Passport reset successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { forgotPassport, resetPassport };