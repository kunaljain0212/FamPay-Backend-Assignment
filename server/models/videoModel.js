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

export default mongoose.model('Video', Video);
