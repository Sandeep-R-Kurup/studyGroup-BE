import express from 'express';
import { createStudyGroup, getAllStudyGroups, getStudyGroupById, joinStudyGroup, leaveStudyGroup, } from '../controllers/studyGroupController';
import auth from '../middlewares/auth';
const router = express.Router();
router.route('/').post(auth, createStudyGroup).get(getAllStudyGroups);
router.route('/:id').get(getStudyGroupById);
router.route('/:id/join').post(auth, joinStudyGroup);
router.route('/:id/leave').post(auth, leaveStudyGroup);
export default router;
