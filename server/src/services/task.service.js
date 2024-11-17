import Task from "../models/task.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const createTaskService = async (user, taskBody) => {
  if (!user || typeof user !== "string") {
    throw new Error("Invalid user input");
  }
  if (!taskBody || typeof taskBody !== "object") {
    throw new Error("Invalid eventBody input");
  }
  const getUser = await User.findById(user);
  const membersIds = taskBody.members
    .split(",")
    .map((id) => mongoose.Types.ObjectId.createFromHexString(id.trim()));
  const members = await User.find({ _id: { $in: membersIds } });
  const newTask = await Task.create({
    ...taskBody,
    members,
    userId: getUser.id,
  });
  const task = await newTask.save();
  return task;
};

export const updateTaskService = async (taskId, taskBody) => {
  Object.keys(taskBody).forEach(
    (key) =>
      taskBody[key] === "" ||
      taskBody[key] === null ||
      (undefined && delete updatedFields[key])
  );
  const updatedTask = await Event.findByIdAndUpdate(taskId, taskBody, {
    new: true,
  });
  return updatedTask;
};
