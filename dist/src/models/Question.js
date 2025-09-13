"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: true,
    },
    askedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    studyGroup: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "StudyGroup",
    },
    answers: [
        {
            answeredBy: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            answer: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Question = mongoose_1.default.model("Question", QuestionSchema);
exports.default = Question;
