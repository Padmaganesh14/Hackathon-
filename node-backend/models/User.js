const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    kycStatus: {
      type: String,
      default: 'Not Verified',
    },
    trustScore: {
      type: Number,
      default: 0,
    },
    nationality: {
      type: String,
      default: 'India',
    },
    idType: {
      type: String,
      default: 'Aadhaar + PAN',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
