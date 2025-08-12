import express from 'express';
import { createChannel, getChannel, getChannelByUser } from '../controllers/channelController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createChannel);
router.get('/user/:userId', getChannelByUser); 
router.get('/:id', getChannel);                    

export default router;
