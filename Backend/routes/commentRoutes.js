// backend/routes/commentRoutes.js
import express from 'express';
import { addComment, getCommentsByVideo, updateComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.post('/:videoId', addComment);
router.get('/:videoId', getCommentsByVideo);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;
