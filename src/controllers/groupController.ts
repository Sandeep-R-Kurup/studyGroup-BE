import { Request, Response } from "express";
import StudyGroup, { IStudyGroup } from "../models/StudyGroup";
import User, { IUser } from "../models/User";
import GroupGoal from "../models/GroupGoal";
import GroupMemberActivity from "../models/GroupMemberActivity";
import mongoose from "mongoose";
import Redis from "ioredis";

// Ensure a concrete string is passed to Redis constructor to satisfy typings
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

// Helper to build cache keys
const cacheKey = (type: string, groupId: string) => `group:${groupId}:${type}`;

// Invalidate caches for a group
const invalidateGroupCaches = async (groupId: string) => {
  await Promise.all([
    redis.del(cacheKey("leaderboard", groupId)),
    redis.del(cacheKey("progress", groupId)),
  ]);
};

interface AuthRequest extends Request {
  user?: { id: string };
}

// @desc    Create a study group
// @route   POST /api/groups
// @access  Private
export const createStudyGroup = async (req: AuthRequest, res: Response) => {
  const { name, description, members } = req.body;
  const creatorId = req.user?.id;
  if (!creatorId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        error: { code: "UNAUTHORIZED" },
      });
  }
  try {
    const existingGroup = await StudyGroup.findOne({ createdBy: creatorId });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "You are already a creator of another group.",
        error: {
          code: "USER_ALREADY_CREATOR",
          details: "A user can be a creator in only one group at a time.",
        },
      });
    }

    const memberIds: mongoose.Types.ObjectId[] = [];
    if (Array.isArray(members) && members.length > 0) {
      const users = await User.find({ email: { $in: members } });
      users.forEach((u) => memberIds.push(u._id as mongoose.Types.ObjectId));
    }

    const creatorObjectId = new mongoose.Types.ObjectId(creatorId);
    if (!memberIds.some((id) => id.equals(creatorObjectId))) {
      memberIds.push(creatorObjectId);
    }

    const studyGroup = await StudyGroup.create({
      name,
      description,
      createdBy: creatorObjectId,
      members: memberIds,
    });

    const populatedGroup = await StudyGroup.findById(studyGroup._id).populate(
      "createdBy members",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: populatedGroup,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

// @desc    Add a member to a study group
// @route   POST /api/groups/:id/member
// @access  Private (Creator only)
export const addMember = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  const groupId = req.params.id;
  const creatorId = req.user?.id;
  if (!creatorId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        error: { code: "UNAUTHORIZED" },
      });
  }
  try {
    const studyGroup = await StudyGroup.findById(groupId);
    if (!studyGroup) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Group not found",
          error: { code: "GROUP_NOT_FOUND" },
        });
    }

    if (studyGroup.createdBy && studyGroup.createdBy.toString() !== creatorId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the group creator can add members.",
          error: { code: "FORBIDDEN" },
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found",
          error: { code: "USER_NOT_FOUND" },
        });
    }

    if (
      (studyGroup.members as mongoose.Types.ObjectId[]).some(
        (memberId) =>
          memberId &&
          (memberId as mongoose.Types.ObjectId).equals(
            user._id as mongoose.Types.ObjectId
          )
      )
    ) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this group",
        error: {
          code: "USER_ALREADY_MEMBER",
          details: `The email ${email} is already part of this group.`,
        },
      });
    }

    studyGroup.members.push(user._id as mongoose.Types.ObjectId);
    await studyGroup.save();

    const populatedGroup = await StudyGroup.findById(studyGroup._id).populate(
      "members",
      "name email"
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Member added successfully",
        data: populatedGroup,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error",
        error: { code: "SERVER_ERROR", details: error.message },
      });
  }
};

// @desc    Add a new goal to a group
// @route   POST /api/groups/:id/goal
// @access  Private (Creator only)
export const addGoal = async (req: AuthRequest, res: Response) => {
  const groupId = req.params.id;
  const { title, subject, metric, target, deadline, recurring } = req.body;
  const creatorId = req.user?.id;
  if (!creatorId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        error: { code: "UNAUTHORIZED" },
      });
  }
  try {
    const studyGroup = await StudyGroup.findById(groupId);
    if (!studyGroup) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Group not found",
          error: { code: "GROUP_NOT_FOUND" },
        });
    }

    if (studyGroup.createdBy && studyGroup.createdBy.toString() !== creatorId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the group creator can add a goal.",
          error: { code: "FORBIDDEN" },
        });
    }

    const activeGoal = await GroupGoal.findOne({
      studyGroup: groupId,
      isActive: true,
      archived: false,
    });
    if (activeGoal) {
      return res
        .status(409)
        .json({
          success: false,
          message: "An active goal already exists for this group.",
          error: { code: "ACTIVE_GOAL_EXISTS" },
        });
    }

    const newGoal = await GroupGoal.create({
      studyGroup: groupId,
      title,
      subject,
      metric,
      target,
      deadline: deadline ? new Date(deadline) : undefined,
      recurring,
      isActive: true,
      archived: false,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Goal created successfully",
        data: newGoal,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error",
        error: { code: "SERVER_ERROR", details: error.message },
      });
  }
};

// @desc    Record a solved question attempt (activity)
// @route   POST /api/groups/:id/activity
// @access  Private (Member)
export const recordActivity = async (req: AuthRequest, res: Response) => {
  const groupId = req.params.id;
  const { questionId, status, timeSpent } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        error: { code: "UNAUTHORIZED" },
      });
  }
  try {
    const studyGroup = await StudyGroup.findById(groupId);
    if (!studyGroup) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Group not found",
          error: { code: "GROUP_NOT_FOUND" },
        });
    }
    if (
      !(studyGroup.members as mongoose.Types.ObjectId[]).some(
        (memberId) => memberId && memberId.toString() === userId
      )
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User is not a member of this group",
          error: { code: "FORBIDDEN" },
        });
    }
    const activeGoal = await GroupGoal.findOne({
      studyGroup: groupId,
      isActive: true,
      archived: false,
    });
    if (!activeGoal) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No active goal for this group",
          error: { code: "NO_ACTIVE_GOAL" },
        });
    }
    if (activeGoal.deadline && new Date() > new Date(activeGoal.deadline)) {
      activeGoal.isActive = false;
      activeGoal.archived = true;
      await activeGoal.save();
      return res
        .status(400)
        .json({
          success: false,
          message: "The active goal has expired and is now archived.",
          error: { code: "GOAL_EXPIRED" },
        });
    }
    const existingActivity = await GroupMemberActivity.findOne({
      studyGroup: groupId,
      user: userId,
      question: questionId,
    });
    if (existingActivity) {
      return res
        .status(409)
        .json({
          success: false,
          message: "This question has already been counted for this user.",
          error: { code: "DUPLICATE_ACTIVITY" },
        });
    }
    const activity = await GroupMemberActivity.create({
      studyGroup: groupId,
      user: userId,
      question: questionId,
      status,
      timeSpent,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Activity recorded successfully",
        data: activity,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error",
        error: { code: "SERVER_ERROR", details: error.message },
      });
  }
};

// @desc    Group Leaderboard
// @route   GET /api/groups/:id/leaderboard
// @query   page=1&limit=10&subjects=math,physics&sort=questions|timeSpent
// @access  Private (member)
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  const groupId = req.params.id;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized", error: { code: "UNAUTHORIZED" } });
  }
  const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt((req.query.limit as string) || "10", 10), 1), 50);
  const sortMetric = (req.query.sort as string) === "timeSpent" ? "timeSpent" : "questionsSolved";
  const subjectsFilter = (req.query.subjects as string)?.split(",").filter(Boolean) || [];

  try {
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found", error: { code: "GROUP_NOT_FOUND" } });
    }
    if (!(group.members as mongoose.Types.ObjectId[]).some((m) => m && m.toString() === userId)) {
      return res.status(403).json({ success: false, message: "Forbidden", error: { code: "FORBIDDEN" } });
    }

    const activeGoal = await GroupGoal.findOne({ studyGroup: groupId, isActive: true, archived: false });

    const cacheIdParts = [sortMetric];
    if (subjectsFilter.length) cacheIdParts.push(subjectsFilter.sort().join("|"));
    const key = cacheKey("leaderboard", `${groupId}:${cacheIdParts.join(":")}:p${page}:l${limit}`);
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Build match stage
    const match: any = { studyGroup: new mongoose.Types.ObjectId(groupId) };
    // If subjects filter and we have an active goal with subjects subset, filter
    if (subjectsFilter.length && activeGoal) {
      match.status = { $in: ["solved", "correct"] }; // status constraint if needed later
    }

    // Aggregate per user
    const pipeline: any[] = [
      { $match: match },
      {
        $group: {
          _id: "$user",
          questionsSolved: { $sum: 1 },
          timeSpent: { $sum: "$timeSpent" },
          lastActivityAt: { $max: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          avatar: "$user.avatar",
          questionsSolved: 1,
          timeSpent: 1,
          lastActivityAt: 1,
        },
      },
    ];

    // Sort primary metric
    pipeline.push({ $sort: { [sortMetric]: -1, timeSpent: -1, name: 1 } });

    // Pagination
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const results = await GroupMemberActivity.aggregate(pipeline);

    // Ranking (ties share rank)
    let currentRank = 0;
    let lastMetricValue: number | null = null;
    let processed = results.map((r: any, idx: number) => {
      const metricValue = r[sortMetric] || 0;
      if (lastMetricValue === null || metricValue < lastMetricValue) {
        currentRank = idx + 1 + (page - 1) * limit;
        lastMetricValue = metricValue;
      }
      return { rank: currentRank, ...r };
    });

    const response = {
      success: true,
      message: "Leaderboard fetched",
      data: {
        page,
        limit,
        metric: sortMetric,
        results: processed,
      },
    };

    await redis.set(key, JSON.stringify(response), "EX", 60); // 1 minute TTL

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: { code: "SERVER_ERROR", details: error.message } });
  }
};

// @desc    Group Progress toward active goal
// @route   GET /api/groups/:id/progress
// @access  Private (member)
export const getProgress = async (req: AuthRequest, res: Response) => {
  const groupId = req.params.id;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized", error: { code: "UNAUTHORIZED" } });
  }
  try {
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found", error: { code: "GROUP_NOT_FOUND" } });
    }
    if (!(group.members as mongoose.Types.ObjectId[]).some((m) => m && m.toString() === userId)) {
      return res.status(403).json({ success: false, message: "Forbidden", error: { code: "FORBIDDEN" } });
    }

    const goal = await GroupGoal.findOne({ studyGroup: groupId, isActive: true, archived: false });
    if (!goal) {
      return res.status(404).json({ success: false, message: "No active goal", error: { code: "NO_ACTIVE_GOAL" } });
    }

    const key = cacheKey("progress", groupId);
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const match: any = { studyGroup: new mongoose.Types.ObjectId(groupId) };

    const agg = await GroupMemberActivity.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: 1 },
          totalTime: { $sum: "$timeSpent" },
        },
      },
    ]);

    const totals = agg[0] || { totalQuestions: 0, totalTime: 0 };

    const progressValue = goal.metric === "questionsSolved" ? totals.totalQuestions : totals.totalTime;
    const percentage = goal.target > 0 ? Math.min(100, (progressValue / goal.target) * 100) : 0;

    const response = {
      success: true,
      message: "Progress fetched",
      data: {
        goal: {
          id: goal._id,
          title: goal.title,
          subjects: goal.subjects,
          metric: goal.metric,
          target: goal.target,
          deadline: goal.deadline,
          recurring: goal.recurring,
        },
        totals: {
          questionsSolved: totals.totalQuestions,
          timeSpent: totals.totalTime,
        },
        progress: {
          value: progressValue,
          percentage: Number(percentage.toFixed(2)),
        },
      },
    };

    await redis.set(key, JSON.stringify(response), "EX", 60);

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error", error: { code: "SERVER_ERROR", details: error.message } });
  }
};

// Modify addGoal & recordActivity to invalidate caches
const originalAddGoal = addGoal;
export const addGoalWithInvalidation = async (req: AuthRequest, res: Response) => {
  await originalAddGoal(req, res);
  if (req.params.id) await invalidateGroupCaches(req.params.id);
};

const originalRecordActivity = recordActivity;
export const recordActivityWithInvalidation = async (req: AuthRequest, res: Response) => {
  await originalRecordActivity(req, res);
  if (req.params.id) await invalidateGroupCaches(req.params.id);
};
