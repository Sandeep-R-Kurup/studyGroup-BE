"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthEnabled = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Guard against missing credentials to avoid runtime crash
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;
exports.googleAuthEnabled = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
if (!exports.googleAuthEnabled) {
    // eslint-disable-next-line no-console
    console.warn("Google OAuth disabled: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable.");
}
else {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL || "/auth/google/callback",
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User_1.default.findOne({ googleId: profile.id });
            if (!user) {
                user = await User_1.default.create({
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    name: profile.displayName,
                    avatar: profile.photos?.[0].value,
                });
            }
            return done(null, user);
        }
        catch (error) {
            return done(error, undefined);
        }
    }));
}
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    User_1.default.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});
exports.default = passport_1.default;
