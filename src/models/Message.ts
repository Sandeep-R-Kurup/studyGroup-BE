import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IStudyGroup } from "./StudyGroup";

export interface IMessage extends Document {
  sender: IUser["_id"];
  studyGroup: IStudyGroup["_id"];
  message: string;
}

const MessageSchema: Schema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    studyGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyGroup",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
