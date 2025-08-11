// routes/videoRoutes.js
import express from 'express';
import {createVideo, getAllVideos, getVideoById, updateVideo,deleteVideo } from '../controllers/videoController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',verifyToken, createVideo);
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.put('/:id', verifyToken, updateVideo);
router.delete('/:id', verifyToken, deleteVideo);

export default router;
