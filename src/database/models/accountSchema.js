import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    did: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailConfirmed: {
      type: Boolean,
      required: true,
    },
    accessJwt: {
      type: String,
      required: true,
    },
    refreshJwt: {
      type: String,
      required: true,
    },
    currentlyActive: {
      type: Boolean,
      required: true,
    },
    displayName: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    followersCount: {
      type: Number,
      required: false,
    },
    followsCount: {
      type: Number,
      required: false,
    },
    postsCount: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true, strict: false, strictQuery: false }
);

let Account = null;
try {
  Account = mongoose.model('Account', accountSchema);
} catch (error) {
  Account = mongoose.model('Account');
}

export default Account;
