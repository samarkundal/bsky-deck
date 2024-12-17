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

let User;
try {
  User = mongoose.model('User', userSchema);
} catch (error) {
  User = mongoose.models.User;
}

export default User;
