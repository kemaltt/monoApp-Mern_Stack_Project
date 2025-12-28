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
  return db
    .collection(usersCollectionName)
    .updateOne({ _id: ObjectId(id) }, { $set: updateData });
}

async function insertUser(userInfo) {
  const db = await getDB();
  // wir können das direkt returnen auch (muss nicht wie oben alles extra benannt werden)
  return db.collection(usersCollectionName).insertOne(userInfo); // insertOne() returned auch eine promise, daher await
}

async function updateUserTotalBalance(id, totalBalance) {
  const db = await getDB();
  return db
    .collection(usersCollectionName)
    .updateOne({ _id: ObjectId(id) }, { $set: { totalBalance } });
}

async function updateUser(id, updateData) {
  const db = await getDB();
  return db
    .collection(usersCollectionName)
    .updateOne({ _id: ObjectId(id) }, { $set: updateData });
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
