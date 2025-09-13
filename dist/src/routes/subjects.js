"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subjectController_1 = require("../controllers/subjectController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.route("/").get(subjectController_1.getAllSubjects).post(auth_1.default, subjectController_1.createSubject);
exports.default = router;
