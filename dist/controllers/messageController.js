import Message from "../models/Message";
import StudyGroup from "../models/StudyGroup";
// @desc    Send a message in a study group
export const sendMessage = async (req, res) => {
    const { message, studyGroup } = req.body;
    try {
        const group = await StudyGroup.findById(studyGroup);
        if (!group) {
            return res.status(404).json({ msg: "Study group not found" });
        }
        // Make sure user is a member of the group
        if (!group.members.some((member) => member.toString() === req.user.id)) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        const newMessage = new Message({
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
// @desc    Get all messages for a study group
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            studyGroup: req.params.groupId,
        }).populate("sender", ["name", "avatar"]);
        res.json(messages);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
