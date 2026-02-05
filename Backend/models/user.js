const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // Farmer-specific fields
  role: {
    type: String,
    default: 'farmer',
  },
  phone: {
    type: String,
  },
  village: {
    type: String,
  },
  landSize: {
    type: String,
  },
   profileImage: String,
});

module.exports = mongoose.model('User', userSchema);
