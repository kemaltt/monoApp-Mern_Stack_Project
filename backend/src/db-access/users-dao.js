const { getDB } = require("./getDB");
const { ObjectId } = require("mongodb");

const usersCollectionName = "Users";

async function findAll() {
  const db = await getDB();
  const users = await db.collection(usersCollectionName).find().toArray(); // toArray() returned auch eine promise, daher await
  return users;
}

async function findById(id) {
  const db = await getDB();
  const foundUser = await db
    .collection(usersCollectionName)
    .findOne({ _id: ObjectId(id) }); // findOne() returned auch eine promise, daher await
  return foundUser;
}

async function findByEmail(email) {
  const db = await getDB();
  const foundUser = await db
    .collection(usersCollectionName)
    .findOne({ email: email });
  return foundUser;
}

async function findByResetPassportKey(reset_passport_key) {
  const db = await getDB();
  const foundUser = await db
    .collection(usersCollectionName)
    .findOne({ reset_passport_key: reset_passport_key });
  return foundUser;
}

async function findByIdAndUpdate(id, updateData) {
  const db = await getDB();
  const dataWithTimestamp = {
    ...updateData,
    updatedAt: new Date()
  };
  return db
    .collection(usersCollectionName)
    .updateOne({ _id: ObjectId(id) }, { $set: dataWithTimestamp });
}

async function insertUser(userInfo) {
  const db = await getDB();
  const now = new Date();
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 gün sonra
  
  const userWithTimestamps = {
    ...userInfo,
    status: userInfo.status || 'active',
    license_type: userInfo.license_type || 'trial',
    trial_end_date: userInfo.license_type === 'trial' || !userInfo.license_type ? trialEndDate : null,
    trial_reminder_sent: userInfo.trial_reminder_sent || [],
    lastLogin: userInfo.lastLogin || null,
    createdAt: now,
    updatedAt: now
  };
  // wir können das direkt returnen auch (muss nicht wie oben alles extra benannt werden)
  return db.collection(usersCollectionName).insertOne(userWithTimestamps); // insertOne() returned auch eine promise, daher await
}

async function updateUserTotalBalance(id, totalBalance) {
  const db = await getDB();
  return db
    .collection(usersCollectionName)
    .updateOne({ _id: ObjectId(id) }, { $set: { totalBalance, updatedAt: new Date() } });
}

async function updateUser(id, updateData) {
  const db = await getDB();
  const dataWithTimestamp = {
    ...updateData,
    updatedAt: new Date()
  };
  return db
    .collection(usersCollectionName)
    .updateOne({ _id: ObjectId(id) }, { $set: dataWithTimestamp });
}

module.exports = {
  findAll,
  findByEmail,
  findById,
  insertUser,
  updateUserTotalBalance,
  updateUser,
  findByIdAndUpdate,
  findByResetPassportKey,
};
