"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GroupMemberActivitySchema = new mongoose_1.default.Schema({
    studyGroup: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "StudyGroup",
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    question: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Prevent duplicate counting of the same question per user per group
GroupMemberActivitySchema.index({ studyGroup: 1, user: 1, question: 1 }, { unique: true });
// For leaderboard range queries and recent activity lookups
GroupMemberActivitySchema.index({ studyGroup: 1, createdAt: -1 });
GroupMemberActivitySchema.index({ studyGroup: 1, user: 1, createdAt: -1 });
const GroupMemberActivity = mongoose_1.default.model("GroupMemberActivity", GroupMemberActivitySchema);
exports.default = GroupMemberActivity;
