const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    isEmailSent: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);
