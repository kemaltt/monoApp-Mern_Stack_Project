const TransactionModel = require("../models/TransactionModel");
const UserModel = require("../models/UserModel");
const { deleteFromFirebase } = require("../services/file-upload.service");
const { createActivityLog } = require("../services/activity-log.service");

const addTransaction = async (req, res) => {
  const { amount, income } = req.body;
  const userId = req.userClaims.id;
  try {

    const newTransaction = new TransactionModel({ ...req.body, userId });
    await newTransaction.save();

    const updateAmount = income ? amount : -amount;

    console.log(updateAmount);

    await UserModel.findByIdAndUpdate(userId, { $inc: { total_amount: updateAmount } }, { new: true });

    // Log activity
    const user = await UserModel.findById(userId);
    await createActivityLog({
      user: userId,
      userName: user?.name || 'Unknown',
      action: 'create',
      resourceType: 'transaction',
      resourceId: newTransaction._id.toString(),
      details: { amount, income, name: req.body.name },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      ...newTransaction,
      userId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

const getTransactions = async (req, res) => {
  const userId = req.userClaims.id;

  try {
    const transactions = await TransactionModel.find({ userId });
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // const totalAmount = await UserModel.findById(userId, { total_amount: 1, _id: 0 });
    res.status(200).json({ transactions, totalAmount: { total_amount: user.total_amount }, name: user.name, email: user.email, profile_image: user.profile_image });
  }
  catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

const getTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.userClaims.id;

  try {
    const transaction = await TransactionModel.findOne({ _id: transactionId, userId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    res.status(200).json(transaction);
  }
  catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

const updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.userClaims.id;
  const { amount, income } = req.body;

  try {
    const transaction = await TransactionModel.findOne({ _id: transactionId, userId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const updateAmount = income ? amount : -amount;
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(transactionId, req.body, { new: true });
    await UserModel.findByIdAndUpdate(userId, { $inc: { total_amount: updateAmount } }, { new: true });

    // Log activity
    const user = await UserModel.findById(userId);
    await createActivityLog({
      user: userId,
      userName: user?.name || 'Unknown',
      action: 'update',
      resourceType: 'transaction',
      resourceId: transactionId,
      details: { oldAmount: transaction.amount, newAmount: amount, income },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json(updatedTransaction);
  }
  catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.userClaims.id;

  try {
    const transaction = await TransactionModel.findOne({ _id: transactionId, userId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    const updateAmount = transaction.income ? -transaction.amount : transaction.amount;
    await UserModel.findByIdAndUpdate(userId, { $inc: { total_amount: updateAmount } }, { new: true });
    const deletedTransaction = await TransactionModel.findByIdAndDelete(transactionId);
    
    if (deletedTransaction?.img?.url) {
      await deleteFromFirebase(deletedTransaction?.img?.url);
    }

    // Log activity
    const user = await UserModel.findById(userId);
    await createActivityLog({
      user: userId,
      userName: user?.name || 'Unknown',
      action: 'delete',
      resourceType: 'transaction',
      resourceId: transactionId,
      details: { amount: transaction.amount, income: transaction.income, name: transaction.name },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({ message: "Transaction deleted successfully." });
  }
  catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}



module.exports = { addTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction };