// models/VideoModel.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    thumbnailUrl: String,
    videoUrl: String,
    category: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },

  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;
