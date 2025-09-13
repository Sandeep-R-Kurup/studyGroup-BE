import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IStudyGroup } from "./StudyGroup";
import { IQuestion } from "./Question";

export interface IGroupMemberActivity extends Document {
  studyGroup: IStudyGroup["_id"];
  user: IUser["_id"];
  question: IQuestion["_id"];
  status: "solved" | "correct";
  timeSpent: number;
}

const GroupMemberActivitySchema: Schema = new mongoose.Schema(
  {
    studyGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyGroup",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    status: {
      type: String,
      enum: ["solved", "correct"],
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate counting of the same question per user per group
GroupMemberActivitySchema.index(
  { studyGroup: 1, user: 1, question: 1 },
  { unique: true }
);
// For leaderboard range queries and recent activity lookups
GroupMemberActivitySchema.index({ studyGroup: 1, createdAt: -1 });
GroupMemberActivitySchema.index({ studyGroup: 1, user: 1, createdAt: -1 });

const GroupMemberActivity = mongoose.model<IGroupMemberActivity>(
  "GroupMemberActivity",
  GroupMemberActivitySchema
);

export default GroupMemberActivity;
