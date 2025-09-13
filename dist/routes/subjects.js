import express from 'express';
import { getAllSubjects, createSubject } from '../controllers/subjectController';
import auth from '../middlewares/auth';
const router = express.Router();
router.route('/').get(getAllSubjects).post(auth, createSubject);
export default router;
