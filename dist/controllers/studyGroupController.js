import StudyGroup from "../models/StudyGroup";
// @desc    Create a study group
export const createStudyGroup = async (req, res) => {
    const { name, description, subject } = req.body;
    try {
        const newStudyGroup = new StudyGroup({
            name,
            description,
            subject,
            createdBy: req.user.id,
            members: [req.user.id],
        });
        const studyGroup = await newStudyGroup.save();
        res.json(studyGroup);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
// @desc    Get all study groups
export const getAllStudyGroups = async (req, res) => {
    try {
        const studyGroups = await StudyGroup.find().populate("subject", ["name"]);
        res.json(studyGroups);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
// @desc    Get study group by ID
export const getStudyGroupById = async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id)
            .populate("subject", ["name"])
            .populate("members", ["name", "avatar"]);
        if (!studyGroup) {
            return res.status(404).json({ msg: "Study group not found" });
        }
        res.json(studyGroup);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Study group not found" });
        }
        res.status(500).send("Server Error");
    }
};
// @desc    Join a study group
export const joinStudyGroup = async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id);
        if (!studyGroup) {
            return res.status(404).json({ msg: "Study group not found" });
        }
        // Check if the user is already a member
        if (studyGroup.members.some((member) => member.toString() === req.user.id)) {
            return res.status(400).json({ msg: "User already in this group" });
        }
        studyGroup.members.push(req.user.id);
        await studyGroup.save();
        res.json(studyGroup.members);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
// @desc    Leave a study group
export const leaveStudyGroup = async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id);
        if (!studyGroup) {
            return res.status(404).json({ msg: "Study group not found" });
        }
        // Check if the user is a member
        if (!studyGroup.members.some((member) => member.toString() === req.user.id)) {
            return res.status(400).json({ msg: "User not in this group" });
        }
        // Remove user from members array
        studyGroup.members = studyGroup.members.filter((member) => member.toString() !== req.user.id);
        await studyGroup.save();
        res.json(studyGroup.members);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
