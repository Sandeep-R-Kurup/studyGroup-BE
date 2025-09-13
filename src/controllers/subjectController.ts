import { Request, Response } from "express";
import Subject, { ISubject } from "../models/Subject";

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const createSubject = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const newSubject: ISubject = new Subject({
      name,
      description,
    });

    const subject = await newSubject.save();
    res.json(subject);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
