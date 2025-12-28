const mongoose = require('mongoose');

const connectMongoDB = async (PORT) => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB_URL, {
      dbName: process.env.MONGO_DB_NAME,
      // Wait up to 10s for server selection before throwing
      serverSelectionTimeoutMS: 10000,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // forward error so caller can decide to exit
    throw error;
  }
}

module.exports = { connectMongoDB };