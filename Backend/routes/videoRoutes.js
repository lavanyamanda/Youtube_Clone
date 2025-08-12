import express from 'express';
import { 
  createVideo, 
  getAllVideos, 
  getVideoById, 
  updateVideo, 
  deleteVideo, 
  getVideosByChannel 
} from '../controllers/videoController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createVideo);
router.get('/', getAllVideos);
router.get('/channel/:channelId', getVideosByChannel);  // Get videos by channel ID (specific route)
router.get('/:id', getVideoById);
router.put('/:id', verifyToken, updateVideo);
router.delete('/:id', verifyToken, deleteVideo);

export default router;
