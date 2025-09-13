"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubject = exports.getAllSubjects = void 0;
const Subject_1 = __importDefault(require("../models/Subject"));
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject_1.default.find();
        res.json(subjects);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.getAllSubjects = getAllSubjects;
const createSubject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newSubject = new Subject_1.default({
            name,
            description,
        });
        const subject = await newSubject.save();
        res.json(subject);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.createSubject = createSubject;
