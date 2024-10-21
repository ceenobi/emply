import Leave from "../models/leave.js";
import createHttpError from "http-errors";
import tryCatch from "../utils/tryCatchFn.js";
import { validateField } from "../utils/validateForm.js";
import { uploadSingleImage } from "../services/upload.service.js";
import { isValidObjectId } from "mongoose";
import {
  approveLeaveRequest,
  leaveRequest,
  updateLeaveDetails,
} from "../services/leave.service.js";
import User from "../models/user.js";

export const createLeave = tryCatch(async (req, res, next) => {
  const { photo, description, startDate, endDate, leaveType } = req.body;
  const userId = req.userId;
  if (!description || !startDate || !endDate || !leaveType) {
    return next(createHttpError(400, "Mandated fields are required"));
  }
  let errors = {
    description: validateField(description, "Give reason for leave"),
    startDate: validateField(startDate, "Leave start date is required"),
    endDate: validateField(endDate, "Leave end date is required"),
    leaveType: validateField(leaveType, "Leave type is required"),
  };
  if (
    errors.description ||
    errors.startDate ||
    errors.endDate ||
    errors.leaveType
  ) {
    return next(
      createHttpError(
        400,
        errors.description
          ? errors.description
          : errors.startDate
            ? errors.startDate
            : errors.endDate
              ? errors.endDate
              : errors.leaveType
                ? errors.leaveType
                : "Form validation failed"
      )
    );
  }
  let leavePhoto;
  if (photo) {
    try {
      const photoUploaded = await uploadSingleImage(photo);
      leavePhoto = photoUploaded;
    } catch (error) {
      console.error(error);
      return next(createHttpError(500, "failed to upload image"));
    }
  }
  const leaveBody = {
    leavePhoto,
    description,
    startDate,
    endDate,
    leaveType,
  };
  const leave = await leaveRequest(userId, leaveBody);
  res.status(201).json({ leave, msg: "Leave request created!" });
});

export const getAllUserLeaves = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const leaves = await Leave.find({ userId })
    .populate("userId", "photo firstName lastName")
    .lean()
    .sort({ _id: -1 });

  if (!leaves) {
    return next(createHttpError(404, "No leaves found"));
  }
  res.status(200).json(leaves);
});

export const getAllLeaves = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipCount = (page - 1) * limit;
  const count = await Leave.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const leaves = await Leave.find()
    .populate("userId", "photo firstName lastName")
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!leaves) {
    return next(createHttpError(404, "No leaves found"));
  }
  const leaveRequests = {
    currentPage: page,
    totalPages,
    count,
    leaves,
  };
  res.status(200).json(leaveRequests);
});

export const updateLeave = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { id: leaveId } = req.params;
  const { photo, description, startDate, endDate, leaveType } = req.body;
  if (!isValidObjectId(leaveId) || !leaveId) {
    return next(createHttpError(400, "Invalid leave ID"));
  }
  let errors = {
    description: validateField(description, "Give reason for leave"),
    startDate: validateField(startDate, "Leave start date is required"),
    endDate: validateField(endDate, "Leave end date is required"),
  };
  if (errors.description || errors.startDate || errors.endDate) {
    return next(
      createHttpError(
        400,
        errors.description
          ? errors.description
          : errors.startDate
            ? errors.startDate
            : errors.endDate
              ? errors.endDate
              : "Form validation failed"
      )
    );
  }
  const leave = await Leave.findById(leaveId);
  if (leave.userId.toString() !== userId) {
    return next(createHttpError(403, "Unauthorized to update this leave"));
  }
  let leavePhoto;
  if (photo) {
    try {
      const photoUploaded = await uploadSingleImage(photo);
      leavePhoto = photoUploaded;
    } catch (error) {
      console.error(error);
      return next(createHttpError(500, "failed to upload image"));
    }
  }
  const leaveBody = {
    leavePhoto,
    description,
    startDate,
    endDate,
    leaveType,
  };
  const updatedLeave = await updateLeaveDetails(leaveId, leaveBody);
  res.status(200).json({ updatedLeave, msg: "Leave details updated" });
});

export const deleteLeave = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { id: leaveId } = req.params;
  if (!isValidObjectId(leaveId) || !leaveId) {
    return next(createHttpError(400, "Invalid leave ID"));
  }
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    return next(createHttpError(404, "Leave not found"));
  }
  if (leave.userId.toString() !== userId) {
    return next(createHttpError(403, "Unauthorized to delete this leave"));
  }
  await leave.deleteOne();
  res.status(200).json({ msg: "Leave deleted!" });
});

export const approveLeave = tryCatch(async (req, res, next) => {
  const { id: leaveId } = req.params;
  const { status } = req.body;
  if (!isValidObjectId(leaveId) || !leaveId) {
    return next(createHttpError(400, "Invalid leave ID"));
  }
  if (!status) {
    return next(createHttpError(400, "Leave status is required"));
  }
  const findLeave = await Leave.findById(leaveId);
  if (!findLeave) {
    return next(createHttpError(404, "Leave not found"));
  }
  const leave = await approveLeaveRequest(findLeave, status);
  res.status(200).json({ leave, msg: "Leave status updated!" });
});

export const searchLeaves = tryCatch(async (req, res, next) => {
  const query = req.query.q;
  const userId = req.userId;
  if (!query) {
    return next(createHttpError(400, "Search query is required"));
  }
  const user = await User.findById(userId);
  const sanitizeQuery = query.toLowerCase().replace(/[^\w\s]/gi, "");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const count = await Leave.countDocuments({ userId });
  const totalPages = Math.ceil(count / limit);
  const leaves = user.role.includes("super-admin")
    ? await Leave.find({
        $text: { $search: sanitizeQuery },
      })
        .populate("userId", "photo firstName lastName")
        .sort({ _id: -1 })
        .skip(skipCount)
        .limit(limit)
    : await Leave.find({ userId, $text: { $search: sanitizeQuery } })
        .populate("userId", "photo firstName lastName")
        .sort({ _id: -1 })
        .skip(skipCount)
        .limit(limit);

  if (!leaves) {
    return next(createHttpError(400, "Search did not return a match"));
  }
  const results = {
    currentPage: page,
    totalPages,
    count,
    leaves,
  };
  res.status(200).json(results);
});
