import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['buyer', 'supplier', 'transporter', 'verifier', 'admin'],
      default: 'buyer',
    },
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
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      default: '',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'pending_verification'],
      default: 'active',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    location: {
      address: { type: String, default: 'Chennai, Tamil Nadu' },
      coordinates: { type: [Number], default: [13.0827, 80.2707] }, // [latitude, longitude]
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
