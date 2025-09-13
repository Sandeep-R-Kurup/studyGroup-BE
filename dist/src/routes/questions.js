"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.route("/").post(auth_1.default, questionController_1.askQuestion);
router.route("/:id/answer").post(auth_1.default, questionController_1.answerQuestion);
router.route("/group/:groupId").get(questionController_1.getQuestionsForGroup);
exports.default = router;
