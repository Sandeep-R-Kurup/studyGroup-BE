"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studyGroupController_1 = require("../controllers/studyGroupController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.route("/").post(auth_1.default, studyGroupController_1.createStudyGroup).get(studyGroupController_1.getAllStudyGroups);
router.route("/:id").get(studyGroupController_1.getStudyGroupById);
router.route("/:id/join").post(auth_1.default, studyGroupController_1.joinStudyGroup);
router.route("/:id/leave").post(auth_1.default, studyGroupController_1.leaveStudyGroup);
exports.default = router;
