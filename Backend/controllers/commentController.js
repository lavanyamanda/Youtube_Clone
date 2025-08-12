
import Comment from '../models/CommentModel.js';

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text, userName, channelName } = req.body;

    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const newComment = await Comment.create({
      videoId,
      userId: null,
      userName: userName || 'Guest',
      channelName: channelName || 'Guest Channel',
      text,
    });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
    if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment', error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};
