require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Record = require('./models/RecordModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';

const patchMissingCreatedBy = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const superadmin = await User.findOne({ role: 'superadmin' });
    if (!superadmin) throw new Error("Superadmin not found");

    const result = await Record.updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: superadmin._id } }
    );

    console.log(`✅ Updated ${result.modifiedCount} records.`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error patching records:", err);
    mongoose.disconnect();
  }
};

patchMissingCreatedBy();
