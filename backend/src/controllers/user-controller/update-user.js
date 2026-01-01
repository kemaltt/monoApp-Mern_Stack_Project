const { UserDAO } = require("../../db-access");
const { createActivityLog } = require("../../services/activity-log.service");

async function updateUserProfile({ userId, updateData, req }) {
  const foundUser = await UserDAO.findById(userId);
  
  if (!foundUser) {
    throw new Error("User not found");
  }

  // Kullanıcıyı güncelle
  const result = await UserDAO.updateUser(userId, updateData);

  if (result.matchedCount === 0) {
    throw new Error("User update failed");
  }

  // Güncellenmiş kullanıcıyı al
  const updatedUser = await UserDAO.findById(userId);

  // Activity log oluştur
  await createActivityLog({
    user: userId,
    userName: updatedUser.name,
    action: 'update',
    resourceType: 'profile',
    resourceId: userId,
    details: { updatedFields: Object.keys(updateData) },
    ipAddress: req?.ip,
    userAgent: req?.get('user-agent')
  });

  // Hassas bilgileri kaldır
  const { password, reset_password_key, reset_passport_key, verification_token, ...safeUser } = updatedUser;

  return safeUser;
}

module.exports = {
  updateUserProfile,
};
