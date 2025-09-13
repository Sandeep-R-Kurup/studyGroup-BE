import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IStudyGroup } from "./StudyGroup";

interface IAnswer extends Document {
  answeredBy: IUser["_id"];
  answer: string;
  createdAt: Date;
}

export interface IQuestion extends Document {
  question: string;
  askedBy: IUser["_id"];
  studyGroup: IStudyGroup["_id"];
  answers: IAnswer[];
  createdAt: Date;
}

const QuestionSchema: Schema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
