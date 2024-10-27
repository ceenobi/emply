import createHttpError from "http-errors";
import Event from "../models/event.js";
import User from "../models/user.js";
import Leave from "../models/leave.js";
import { updateProfile } from "../services/user.service.js";
import { uploadSingleImage } from "../services/upload.service.js";
import tryCatch from "../utils/tryCatchFn.js";
import {
  validatePhone,
  validateEmail,
  validateFirstName,
  validateLastName,
} from "../utils/validateForm.js";

export const getAEmployee = tryCatch(async (req, res, next) => {
  const { firstName, employeeId } = req.params;
  if (!firstName || !employeeId) {
    return next(createHttpError(401, "Field params are missing or incomplete"));
  }
  const user = await User.findOne({ employeeId });
  if (!user) {
    return next(createHttpError(404, "User not found"));
  }
  const getUserEvents = await Event.find({ userId: user.id });
  const getUserLeaves = await Leave.find({ userId: user.id });
  res.status(200).json({ user, events: getUserEvents, leaves: getUserLeaves });
});

export const getAllEmployees = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipCount = (page - 1) * limit;
  const count = await User.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const employees = await User.find()
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!employees) {
    return next(createHttpError(404, "No employees found"));
  }
  const users = {
    currentPage: page,
    totalPages,
    count,
    employees,
  };
  res.status(200).json(users);
});

export const updateEmployeeProfile = tryCatch(async (req, res, next) => {
  const { employeeId } = req.params;
  const {
    email,
    photo,
    firstName,
    lastName,
    phone,
    jobTitle,
    bio,
    homeAddress,
    state,
    status,
    country,
    gender,
    dateOfBirth,
    jobType,
    dept, 
    maritalStatus,
  } = req.body;
  if (!employeeId) {
    return next(createHttpError(401, "EmployeeId is missing"));
  }
  let errors = {
    email: validateEmail(email),
    firstName: validateFirstName(firstName),
    lastName: validateLastName(lastName),
    phone: validatePhone(phone),
  };
  if (errors.email || errors.firstName || errors.lastName || errors.phone) {
    return next(
      createHttpError(
        400,
        errors.email
          ? errors.email
          : errors.firstName
            ? errors.firstName
            : errors.lastName
              ? errors.lastName
              : errors.phone
                ? errors.phone
                : "Form validation failed"
      )
    );
  }
  let profilePhoto;
  if (photo) {
    try {
      const photoUploaded = await uploadSingleImage(photo);
      profilePhoto = photoUploaded;
    } catch (error) {
      console.error(error);
      return next(createHttpError(500, "failed to upload image"));
    }
  }
  const user = {
    email,
    profilePhoto,
    firstName,
    lastName,
    phone,
    jobTitle,
    bio,
    homeAddress,
    state,
    country,
    status,
    gender,
    dateOfBirth,
    jobType,
    dept, 
    maritalStatus,
  };
  const updatedProfile = await updateProfile(employeeId, user);
  res.status(200).json({ updatedProfile, msg: "User profile updated" });
});

export const searchEmployee = tryCatch(async (req, res, next) => {
  const query = req.query.q;
  if (!query) {
    return next(createHttpError(400, "Search query is required"));
  }
  const sanitizeQuery = query.toLowerCase().replace(/[^\w\s]/gi, "");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipCount = (page - 1) * limit;
  const count = await User.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const employees = await User.find({
    $text: { $search: sanitizeQuery },
  })
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!employees) {
    return next(createHttpError(400, "Search did not return a match"));
  }
  const data = {
    currentPage: page,
    totalPages,
    count,
    employees,
  };
  res.status(200).json(data);
});

export const getEmployeesByDept = tryCatch(async (req, res, next) => {
  const { dept } = req.params;
  if (!dept) {
    return next(createHttpError(400, "Department name is required"));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipCount = (page - 1) * limit;
  const count = await User.countDocuments({ dept });
  const totalPages = Math.ceil(count / limit);
  const department = await User.find({ dept })
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!department) {
    return next(createHttpError(404, "No employees found in this department"));
  }
  const employees = {
    currentPage: page,
    totalPages,
    count,
    department,
  };
  res.status(200).json(employees);
});

export const getEmployees = tryCatch(async (req, res, next) => {
  const employees = await User.find();
  if (!employees) {
    return next(createHttpError(404, "No employees found"));
  }
  res.status(200).json(employees);
});
