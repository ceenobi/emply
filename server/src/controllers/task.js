import Task from "../models/task.js";
import createHttpError from "http-errors";
import tryCatch from "../utils/tryCatchFn.js";
import { validateField } from "../utils/validateForm.js";
import { isValidObjectId } from "mongoose";
import {
  createTaskService,
  updateTaskService,
} from "../services/task.service.js";

export const createATask = tryCatch(async (req, res, next) => {
  const {
    title,
    description,
    startDate,
    endDate,
    status,
    members,
    priority,
    tags,
  } = req.body;
  const userId = req.userId;
  if (!title || !description || !startDate || !status || !tags) {
    return next(createHttpError(400, "Please fill required fields"));
  }
  const taskBody = {
    title,
    description,
    startDate,
    endDate,
    status,
    members,
    priority,
    tags,
  };
  const task = await createTaskService(userId, taskBody);
  res.status(201).json({ task, msg: "Task created!" });
});

export const getAllTask = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const count = await Task.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const tasks = await Task.find()
    .populate("userId", "photo firstName lastName")
    .populate("members", "photo firstName lastName employeeId")
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(limit);
  if (!tasks) {
    return next(createHttpError(400, "No events found"));
  }
  const data = {
    currentPage: page,
    totalPages,
    count,
    tasks,
  };
  res.status(200).json(data);
});

export const getATask = tryCatch(async (req, res, next) => {
  const { taskId } = req.params;
  if (!taskId) {
    return next(createHttpError(400, "Task id is required"));
  }
  const task = await Task.findById(taskId)
    .populate("userId", "photo firstName lastName")
    .populate("members", "photo firstName lastName employeeId");
  if (!task) {
    return next(createHttpError(400, "Task not found"));
  }
  // cache.set("department", department);
  res.status(200).json(task);
});

export const updateTask = tryCatch(async (req, res, next) => {
  const userId = req.userId;
  const { taskId } = req.params;
  const {
    title,
    description,
    startDate,    
    endDate,
    status,
    members,
    priority,
    tags,
  } = req.body;

  if (!taskId) {
    return next(createHttpError(400, "Task id params is required"));
  }
  const findTask = await Task.findById(taskId);
  if (!findTask) {
    return next(createHttpError(400, "Task not found"));
  }
  const taskBody = {
    title,
    description,
    startDate,
    endDate,
    status,
    members,
    priority,
    tags,
  };
  const task = await updateTaskService(taskId, taskBody);
  res.status(200).json({ task, msg: "Task updated" });
});
