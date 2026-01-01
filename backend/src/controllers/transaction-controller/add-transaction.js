const { TransactionsDAO, UserDAO } = require("../../db-access");
const { makeUser } = require("../../domain/User");
const { createActivityLog } = require("../../services/activity-log.service");

async function createNewTransaction({
  userId,
  amount,
  name,
  createdAt,
  income,
  img,
  req
}) {
  const foundUser = await UserDAO.findById(userId);

  if (!foundUser) {
    throw new Error("User not found");
  }

  const transaction = {
    name,
    income: income === "true" ? true : false,
    amount: Number(amount),
    createdAt: new Date(createdAt).getTime(),
    img,
    userId,
  };

  const user = makeUser(foundUser);
  const totalBalance = user.totalBalance;

  // Transaction ekleniyor
  const insertResult = await TransactionsDAO.insertTransaction(transaction, userId);

  // Eklenen transaction'ın ID'si alınıyor
  const transactionId = insertResult.insertedId;

  if (!transactionId) {
    throw new Error("Transaction ID not found");
  }

  // Kullanıcının toplam bakiyesi güncelleniyor
  const newTotalBalance = income
    ? totalBalance + Number(amount)
    : totalBalance - Number(amount);

  const updateResult = await UserDAO.updateUserTotalBalance(
    userId,
    newTotalBalance
  );

  // Activity log oluştur
  await createActivityLog({
    user: userId,
    userName: user.name,
    action: 'create',
    resourceType: 'transaction',
    resourceId: transactionId.toString(),
    details: { name, amount: Number(amount), income: income === "true" },
    ipAddress: req?.ip,
    userAgent: req?.get('user-agent')
  });

  // Transaction ID'yi döndür
  return { transactionId, insertResult, updateResult };
}

module.exports = { createNewTransaction };
