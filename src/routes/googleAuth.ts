import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: any, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    res.redirect(`/?token=${token}`);
  }
);

export default router;
