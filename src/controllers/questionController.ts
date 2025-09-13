import { Request, Response } from "express";
import Question, { IQuestion } from "../models/Question";
import StudyGroup from "../models/StudyGroup";

// @desc    Ask a question in a study group
export const askQuestion = async (req: Request, res: Response) => {
  const { question, studyGroup } = req.body;

  try {
    const group = await StudyGroup.findById(studyGroup);
    if (!group) {
      return res.status(404).json({ msg: "Study group not found" });
    }

    const newQuestion: IQuestion = new Question({
      question,
      studyGroup,
      askedBy: (req as any).user.id,
    });

    const result = await newQuestion.save();
    res.json(result);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Answer a question
export const answerQuestion = async (req: Request, res: Response) => {
  const { answer } = req.body;

  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    const newAnswer = {
      answer,
      answeredBy: (req as any).user.id,
    };

    question.answers.unshift(newAnswer as any);
    await question.save();

    res.json(question.answers);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all questions for a study group
export const getQuestionsForGroup = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find({
      studyGroup: req.params.groupId,
    }).populate("askedBy", ["name", "avatar"]);
    res.json(questions);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
