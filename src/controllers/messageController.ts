import { Request, Response } from "express";
import Message, { IMessage } from "../models/Message";
import StudyGroup from "../models/StudyGroup";

// @desc    Send a message in a study group
export const sendMessage = async (req: Request, res: Response) => {
  const { message, studyGroup } = req.body;

  try {
    const group = await StudyGroup.findById(studyGroup);
    if (!group) {
      return res.status(404).json({ msg: "Study group not found" });
    }

    // Make sure user is a member of the group
    if (
      !group.members.some(
        (member: any) => member.toString() === (req as any).user.id
      )
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const newMessage: IMessage = new Message({
      message,
      studyGroup,
      sender: (req as any).user.id,
    });

    const result = await newMessage.save();
    res.json(result);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all messages for a study group
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({
      studyGroup: req.params.groupId,
    }).populate("sender", ["name", "avatar"]);
    res.json(messages);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
