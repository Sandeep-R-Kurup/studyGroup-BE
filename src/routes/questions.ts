import express from "express";
import {
  askQuestion,
  answerQuestion,
  getQuestionsForGroup,
} from "../controllers/questionController";
import auth from "../middlewares/auth";

const router = express.Router();

router.route("/").post(auth, askQuestion);
router.route("/:id/answer").post(auth, answerQuestion);
router.route("/group/:groupId").get(getQuestionsForGroup);

export default router;
