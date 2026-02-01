const mongoose = require('mongoose');

const connectDB = async () => {
  // await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connect('mongodb+srv://gaffarbharatpay_db_user:ta3vMDzj9nMnvNrX@demoapps.qzwl3wv.mongodb.net/DepositModel');
  console.log('✅ MongoDB Connected');
};

module.exports = connectDB;
