import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import subjectRoutes from "./src/routes/subjects.js";
import studyGroupRoutes from "./src/routes/studyGroups.js";
import questionRoutes from "./src/routes/questions.js";
import messageRoutes from "./src/routes/messages.js";

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/studygroups", studyGroupRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
