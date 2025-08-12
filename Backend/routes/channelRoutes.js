import express from 'express';
import { createChannel, getChannel, getChannelByUser } from '../controllers/channelController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createChannel);       // Create Channel (protected)
router.get('/user/:userId', getChannelByUser);      // Get channel by user ID
router.get('/:id', getChannel);                      // Get channel by channel ID

export default router;
