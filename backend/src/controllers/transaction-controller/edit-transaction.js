const { TransactionsDAO, UserDAO } = require("../../db-access");
const { createActivityLog } = require("../../services/activity-log.service");

async function updateTransaction({ transactionId, req, ...newValue }, userId) {

  const updatedTransaction = await TransactionsDAO.editTransaction(
    transactionId,
    userId,
    newValue
  );
  
  // Kullanıcı bilgisini al
  const user = await UserDAO.findById(userId);
  
  // Activity log oluştur
  if (user) {
    await createActivityLog({
      user: userId,
      userName: user.name,
      action: 'update',
      resourceType: 'transaction',
      resourceId: transactionId,
      details: { updatedFields: Object.keys(newValue) },
      ipAddress: req?.ip,
      userAgent: req?.get('user-agent')
    });
  }
  
  return updatedTransaction;
}

module.exports = {
  updateTransaction,
};
