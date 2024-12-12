import mongoose from 'mongoose';

// Define the schema
const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      default: 250,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feedType: {
      type: String,
      default: 'posts',
    },
    columnType: {
      type: String,
      default: 'feed',
    },
    query: {
      type: Object,
    },
    params: {
      type: Object,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists before creating a new one
const Column = mongoose.models.Column || mongoose.model('Column', columnSchema);

export default Column;
