const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin@123', 10);

    const admin = new User({
      name: 'admin',
      email: 'admin@diksha.org',
      phone: '8073707154',
      password: hashedPassword,
      role: 'admin',
      isApproved: true
    });

    await admin.save();
    console.log('✅ Admin user created: admin@diksha.org');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
