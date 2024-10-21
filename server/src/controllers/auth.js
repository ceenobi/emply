import User from "../models/user.js";
import createHttpError from "http-errors";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import tryCatch from "../utils/tryCatchFn.js";
import {
  createUser,
  getAuthenticatedUser,
  saveNewPassword,
  savePasswordResetSuccess,
  sendPasswordResetLink,
  validateLogin,
  verifyEmailCode,
} from "../services/auth.service.js";
import {
  validatePhone,
  validateDepartment,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
  validateRole,
} from "../utils/validateForm.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import Event from "../models/event.js";
import Leave from "../models/leave.js";
import { isValidObjectId } from "mongoose";

export const register = tryCatch(async (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    dept,
    phone,
    role,
    gender,
    dateOfBirth,
    jobType
  } = req.body;
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !dept ||
    !phone ||
    !role ||
    !gender ||
    !dateOfBirth
  ) {
    return next(createHttpError(400, "Please fill all form fields"));
  }
  let errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    firstName: validateFirstName(firstName),
    lastName: validateLastName(lastName),
    dept: validateDepartment(dept),
    phone: validatePhone(phone),
    role: validateRole(role),
  };
  if (
    errors.email ||
    errors.password ||
    errors.firstName ||
    errors.lastName ||
    errors.dept ||
    errors.phone ||
    errors.role
  ) {
    return next(
      createHttpError(
        400,
        errors.email
          ? errors.email
          : errors.password
            ? errors.password
            : errors.firstName
              ? errors.firstName
              : errors.lastName
                ? errors.lastName
                : errors.phone
                  ? errors.phone
                  : errors.dept
                    ? errors.dept
                    : errors.role
                      ? errors.role
                      : "Form validation failed"
      )
    );
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return next(createHttpError(400, "User already exists with that email"));
  }
  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    return next(createHttpError(400, "Phone number already exists"));
  }
  const registerUser = {
    email,
    password,
    firstName,
    lastName,
    phone,
    dept,
    role,
    gender,
    dateOfBirth,
    jobType
  };
  await createUser(registerUser);
  res.status(201).json({
    msg: "Registration success",
  });
});

export const verifyEmail = tryCatch(async (req, res, next) => {
  const { code } = req.body;
  if (!code) {
    return next(createHttpError(400, "Verification code is required"));
  }
  const emailCode = await User.findOne({
    verificationToken: code,
  });
  if (!emailCode) {
    return next(createHttpError(400, "Invalid verification code"));
  }
  if (emailCode.verificationTokenExpiresAt < Date.now()) {
    return next(createHttpError(400, "Verification code has expired"));
  }
  const user = await verifyEmailCode(emailCode);
  if (!user) {
    return next(createHttpError(500, "Failed to verify email"));
  }
  res.status(200).json({ msg: "Email verified successfully" });
});

export const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "Email or password is missing"));
  }
  let errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (errors.email || errors.password) {
    return next(
      createHttpError(
        400,
        errors.email
          ? errors.email
          : errors.password
            ? errors.password
            : "Form validation failed"
      )
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(createHttpError(400, "Account not found"));
  }
  const loginUser = await validateLogin(user, password);
  if (!loginUser) {
    return next(createHttpError(400, "Invalid credentials"));
  }
  generateTokenAndSetCookie(req, user._id);
  res.status(200).json({
    msg: `Authenticated as ${user.firstName + " " + user.lastName}`,
    user: {
      ...user._doc,
      password: undefined,
    },
  });
});

export const authenticatedUser = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return next(createHttpError(403, "User not authenticated"));
  }
  const user = await getAuthenticatedUser(userId);
  res.status(200).json(user);
});

export const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send("Logged out");
    }
  });
};

export const forgotPassword = tryCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(createHttpError(400, "Email is required"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(400, "User not found"));
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = resetTokenExpiresAt;
  await user.save();
  await sendPasswordResetLink(user, resetToken);
  res.status(200).json({ msg: "Reset password link sent to your email" });
});

export const resetPassword = tryCatch(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password || !token) {
    return next(createHttpError(401, "Password or reset token is missing"));
  }
  const user = await User.findOne({
    resetPasswordToken: token,
  });
  if (!user) {
    return next(createHttpError(400, "Invalid or expired reset token"));
  }
  if (user.resetPasswordExpiresAt < Date.now()) {
    return next(createHttpError(400, "Invalid or expired reset token"));
  }
  await savePasswordResetSuccess(user, password);
  res.status(200).json({ msg: "Password reset successfull" });
});

export const changePassword = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(
      createHttpError(400, "Current password and new password are required")
    );
  }
  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(createHttpError(401, "User not found"));
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(createHttpError(401, "Invalid current password"));
  }
  await saveNewPassword(user, newPassword);
  res.status(200).json({ msg: "Password changed successfully" });
});

export const deleteUserAccount = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return next(createHttpError(401, "User not found"));
  }
  await Event.deleteMany({ userId: userId });
  await User.findByIdAndDelete(userId);
  res.status(200).send("Your account has been deleted");
});

export const adminDeleteUserAccount = tryCatch(async (req, res, next) => {
  const { id: employeeId } = req.params;
  if (!employeeId || !isValidObjectId(employeeId)) {
    return next(createHttpError(401, "Employee not found"));
  }
  await Event.deleteMany({ userId: employeeId });
  await User.findByIdAndDelete(employeeId);
  await Leave.deleteMany(employeeId);
  res.status(200).send("Account deleted!");
});
