import express from "express";
import auth from "../middlewares/auth";
import {
  createStudyGroup as createGroupHandler,
  addMember as addMemberHandler,
  addGoalWithInvalidation as addGoalHandler,
  recordActivityWithInvalidation as recordActivityHandler,
  getLeaderboard as getLeaderboardHandler,
  getProgress as getProgressHandler,
} from "../controllers/groupController";

const router = express.Router();

// Adapter to normalize handler signature for Express typings
const wrap = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Core group management
router.post("/", auth, wrap(createGroupHandler));
router.post("/:id/member", auth, wrap(addMemberHandler));

// Goals & activities (with cache invalidation)
router.post("/:id/goal", auth, wrap(addGoalHandler));
router.post("/:id/activity", auth, wrap(recordActivityHandler));

// Analytics
router.get("/:id/leaderboard", auth, wrap(getLeaderboardHandler));
router.get("/:id/progress", auth, wrap(getProgressHandler));

export default router;
