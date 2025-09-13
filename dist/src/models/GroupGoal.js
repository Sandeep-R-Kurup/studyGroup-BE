"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GroupGoalSchema = new mongoose_1.default.Schema({
    studyGroup: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
GroupGoalSchema.index({ studyGroup: 1, isActive: 1, archived: 1 });
GroupGoalSchema.index({ deadline: 1 });
const GroupGoal = mongoose_1.default.model("GroupGoal", GroupGoalSchema);
exports.default = GroupGoal;
