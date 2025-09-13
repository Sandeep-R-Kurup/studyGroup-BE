import mongoose, { Document, Schema } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description?: string;
  createdAt: Date;
}

const SubjectSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ISubject>("Subject", SubjectSchema);
