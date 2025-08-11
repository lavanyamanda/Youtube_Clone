// routes/channelRoutes.js
import express from 'express';
import { createChannel, getChannel,getChannelByUser } from '../controllers/channelController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createChannel); // Protected: Create Channel
router.get('/:id', getChannel);               // Public: Get Channel Info
router.get('/user/:userId', getChannelByUser);

export default router;
    