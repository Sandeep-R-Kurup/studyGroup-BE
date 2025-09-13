import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
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
}, { timestamps: true });
const Message = mongoose.model("Message", MessageSchema);
export default Message;
