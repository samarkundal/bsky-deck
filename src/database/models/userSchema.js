import mongoose from 'mongoose';

// Define the schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    providerId: {
      type: String,
    },
    provider: {
      type: String,
    },
    providerAccountId: {
      type: String,
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tempSessionId: {
      type: String,
    },
    lastTempSessionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
