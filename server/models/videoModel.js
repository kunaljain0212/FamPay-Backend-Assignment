import mongoose from 'mongoose';

const Video = new mongoose.Schema({
  _id: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  thumbnails: {
    default: {
      type: String,
    },
    high: {
      type: String,
    },
  },
});

// Add text index to enable advanced search
Video.index({ title: 'text', description: 'text' });

export default mongoose.model('Video', Video);
