import Subject from "../models/Subject";
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
export const createSubject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newSubject = new Subject({
            name,
            description,
        });
        const subject = await newSubject.save();
        res.json(subject);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
