import Task from "../models/task.js";
import createHttpError from "http-errors";
import tryCatch from "../utils/tryCatchFn.js";
import { validateField } from "../utils/validateForm.js";
import { uploadSingleImage } from "../services/upload.service.js";
import { isValidObjectId } from "mongoose";
import { createTaskService } from "../services/task.service.js";

export const createATask = tryCatch(async (req, res, next) => {
  const { title, description, startDate, endDate, status, members, priority, tags } =
    req.body;  
  const userId = req.userId;
  if (!title || !description || !startDate || !endDate || !status || !tags) {
    return next(createHttpError(400, "All fields are required"));
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
  
})
