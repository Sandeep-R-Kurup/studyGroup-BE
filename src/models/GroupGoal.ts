import mongoose, { Document, Schema } from "mongoose";
import { IStudyGroup } from "./StudyGroup";

export interface IGroupGoal extends Document {
  studyGroup: IStudyGroup["_id"];
  title: string;
  subjects: string[]; // multiple subjects supported
  metric: "questionsSolved" | "timeSpent";
  target: number;
  deadline?: Date;
  recurring?: "daily" | "weekly";
  isActive: boolean;
  archived: boolean;
  lastResetAt?: Date;
}

const GroupGoalSchema: Schema = new mongoose.Schema(
  {
    studyGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyGroup",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
      default: [],
    },
    metric: {
      type: String,
      enum: ["questionsSolved", "timeSpent"],
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
    },
    recurring: {
      type: String,
      enum: ["daily", "weekly"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    lastResetAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

GroupGoalSchema.index({ studyGroup: 1, isActive: 1, archived: 1 });
GroupGoalSchema.index({ deadline: 1 });

const GroupGoal = mongoose.model<IGroupGoal>("GroupGoal", GroupGoalSchema);

export default GroupGoal;
