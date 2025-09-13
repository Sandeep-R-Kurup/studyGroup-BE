import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const newUser = new User({
            name,
            email,
            password,
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        const payload = {
            user: {
                id: newUser.id,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
