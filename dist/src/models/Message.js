"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    studyGroup: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "StudyGroup",
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Message = mongoose_1.default.model("Message", MessageSchema);
exports.default = Message;
