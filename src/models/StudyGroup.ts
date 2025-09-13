import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { ISubject } from "./Subject";

export interface IStudyGroup extends Document {
  name: string;
  description?: string;
  subject: ISubject["_id"];
  createdBy: IUser["_id"];
  members: IUser["_id"][];
}

const StudyGroupSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const StudyGroup = mongoose.model<IStudyGroup>("StudyGroup", StudyGroupSchema);

export default StudyGroup;
