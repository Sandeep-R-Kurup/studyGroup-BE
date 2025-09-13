import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./src/config/db";
import authRoutes from "./src/routes/auth";
import subjectRoutes from "./src/routes/subjects";
import studyGroupRoutes from "./src/routes/studyGroups";
import questionRoutes from "./src/routes/questions";
import messageRoutes from "./src/routes/messages";
import passport, { googleAuthEnabled } from "./src/config/passport";
import googleAuthRoutes from "./src/routes/googleAuth";
import groupRoutes from "./src/routes/groups"; // new groups routes

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
if (googleAuthEnabled) {
  app.use("/auth", googleAuthRoutes);
}
app.use("/api/subjects", subjectRoutes);
app.use("/api/studygroups", studyGroupRoutes);
app.use("/api/groups", groupRoutes); // mount new feature routes
app.use("/api/questions", questionRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (!googleAuthEnabled) {
    console.log("Google OAuth routes disabled - missing env vars.");
  }
});
