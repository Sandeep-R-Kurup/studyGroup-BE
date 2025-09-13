import mongoose from "mongoose";
const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    studyGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyGroup",
    },
    answers: [
        {
            answeredBy: {
                type: mongoose.Schema.Types.ObjectId,
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
const Question = mongoose.model("Question", QuestionSchema);
export default Question;
