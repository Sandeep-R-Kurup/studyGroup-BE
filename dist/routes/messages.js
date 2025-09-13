import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import auth from '../middlewares/auth';
const router = express.Router();
router.route('/:groupId').post(auth, sendMessage).get(auth, getMessages);
export default router;
