import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../config/mail/emails.js";
import env from "../utils/validateEnv.js";
import { generateRandomUniqueId } from "../utils/generateRandomId.js";

export const getAuthenticatedUser = async (sessionUser) => {
  const user = await User.findById(sessionUser).exec();
  return user;
};

export const createUser = async (user) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const verificationToken = generateVerificationToken();
  const newUser = await User.create({
    email: user.email,
    password: passwordHash,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    dept: user.dept,
    role: user.role,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    employeeId: generateRandomUniqueId(),
    jobType: user.jobType,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
  });
  await newUser.save();
  // await sendVerificationEmail(user.email, verificationToken);
  return newUser;
};

export const validateLogin = async (user, password) => {
  const validateUser = await bcrypt.compare(password, user.password);
  return validateUser;
};

export const verifyEmailCode = async (user) => {
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();
  await sendWelcomeEmail(user.email, user.firstName, user.lastName);
  return user;
};

export const sendPasswordResetLink = async (user, resetToken) => {
  await sendPasswordResetEmail(
    user.email,
    user.firstName,
    user.lastName,
    `${env.CLIENT_URL}/reset-password/${resetToken}`
  );
};
export const savePasswordResetSuccess = async (user, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();
  await sendResetSuccessEmail(user.email, user.firstName, user.lastName);
};
export const saveNewPassword = async (user, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await User.updateOne({ _id: user.id }, { password: hashedPassword });
  await sendResetSuccessEmail(user.email, user.firstName, user.lastName);
};
