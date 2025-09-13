import mongoose from "mongoose";
const StudyGroupSchema = new mongoose.Schema({
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
}, { timestamps: true });
const StudyGroup = mongoose.model("StudyGroup", StudyGroupSchema);
export default StudyGroup;
