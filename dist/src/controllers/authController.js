"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const newUser = new User_1.default({
            name,
            email,
            password,
        });
        const salt = await bcryptjs_1.default.genSalt(10);
        newUser.password = await bcryptjs_1.default.hash(password, salt);
        await newUser.save();
        const payload = {
            user: {
                id: newUser.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
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
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
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
exports.login = login;
