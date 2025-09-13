"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const StudyGroupSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    subject: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Subject",
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    members: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });
const StudyGroup = mongoose_1.default.model("StudyGroup", StudyGroupSchema);
exports.default = StudyGroup;
