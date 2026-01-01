const { TransactionsDAO, UserDAO } = require('../../db-access');
const { createActivityLog } = require('../../services/activity-log.service');

async function removeTransaction({ transactionId, userId, req }) {
    // Transaction'ı sil
    const result = await TransactionsDAO.deleteTransaction(transactionId, userId);
    
    // Kullanıcı bilgisini al
    const user = await UserDAO.findById(userId);
    
    // Activity log oluştur
    if (user) {
      await createActivityLog({
        user: userId,
        userName: user.name,
        action: 'delete',
        resourceType: 'transaction',
        resourceId: transactionId,
        details: { deleted: true },
        ipAddress: req?.ip,
        userAgent: req?.get('user-agent')
      });
    }
    
    return result;
};

module.exports = { removeTransaction };

