"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionsForGroup = exports.answerQuestion = exports.askQuestion = void 0;
const Question_1 = __importDefault(require("../models/Question"));
const StudyGroup_1 = __importDefault(require("../models/StudyGroup"));
// @desc    Ask a question in a study group
const askQuestion = async (req, res) => {
    const { question, studyGroup } = req.body;
    try {
        const group = await StudyGroup_1.default.findById(studyGroup);
        if (!group) {
            return res.status(404).json({ msg: "Study group not found" });
        }
        const newQuestion = new Question_1.default({
            question,
            studyGroup,
            askedBy: req.user.id,
        });
        const result = await newQuestion.save();
        res.json(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.askQuestion = askQuestion;
// @desc    Answer a question
const answerQuestion = async (req, res) => {
    const { answer } = req.body;
    try {
        const question = await Question_1.default.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ msg: "Question not found" });
        }
        const newAnswer = {
            answer,
            answeredBy: req.user.id,
        };
        question.answers.unshift(newAnswer);
        await question.save();
        res.json(question.answers);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.answerQuestion = answerQuestion;
// @desc    Get all questions for a study group
const getQuestionsForGroup = async (req, res) => {
    try {
        const questions = await Question_1.default.find({
            studyGroup: req.params.groupId,
        }).populate("askedBy", ["name", "avatar"]);
        res.json(questions);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.getQuestionsForGroup = getQuestionsForGroup;
