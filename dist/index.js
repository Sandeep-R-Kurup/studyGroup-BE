"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./src/config/db"));
const auth_1 = __importDefault(require("./src/routes/auth"));
const subjects_1 = __importDefault(require("./src/routes/subjects"));
const studyGroups_1 = __importDefault(require("./src/routes/studyGroups"));
const questions_1 = __importDefault(require("./src/routes/questions"));
const messages_1 = __importDefault(require("./src/routes/messages"));
const passport_1 = __importStar(require("./src/config/passport"));
const googleAuth_1 = __importDefault(require("./src/routes/googleAuth"));
const app = (0, express_1.default)();
// Connect to database
(0, db_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
// Routes
app.use("/api/auth", auth_1.default);
if (passport_1.googleAuthEnabled) {
    app.use("/auth", googleAuth_1.default);
}
app.use("/api/subjects", subjects_1.default);
app.use("/api/studygroups", studyGroups_1.default);
app.use("/api/questions", questions_1.default);
app.use("/api/messages", messages_1.default);
app.get("/", (req, res) => {
    res.send("API is running...");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (!passport_1.googleAuthEnabled) {
        console.log("Google OAuth routes disabled - missing env vars.");
    }
});
