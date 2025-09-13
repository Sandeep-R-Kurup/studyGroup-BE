"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const StudyGroup_1 = __importDefault(require("../models/StudyGroup"));
// @desc    Send a message in a study group
const sendMessage = async (req, res) => {
    const { message, studyGroup } = req.body;
    try {
        const group = await StudyGroup_1.default.findById(studyGroup);
        if (!group) {
            return res.status(404).json({ msg: "Study group not found" });
        }
        // Make sure user is a member of the group
        if (!group.members.some((member) => member.toString() === req.user.id)) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        const newMessage = new Message_1.default({
            message,
            studyGroup,
            sender: req.user.id,
        });
        const result = await newMessage.save();
        res.json(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.sendMessage = sendMessage;
// @desc    Get all messages for a study group
const getMessages = async (req, res) => {
    try {
        const messages = await Message_1.default.find({
            studyGroup: req.params.groupId,
        }).populate("sender", ["name", "avatar"]);
        res.json(messages);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.getMessages = getMessages;
