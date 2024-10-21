import jwt from "jsonwebtoken";
import env from "./validateEnv.js";

export const generateVerificationToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
export const generateTokenAndSetCookie = (req, userId) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "1d",
  });
  req.session.token = token;
};

// res.cookie("emply-token", token, {
//   httpOnly: true,
//   secure: env.NODE_ENV === "production",
//   sameSite: "strict",
//   maxAge: 7 * 24 * 60 * 60 * 1000,
// });
