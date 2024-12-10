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
  const tags = taskBody.tags.split(",");
  const members = await User.find({ _id: { $in: membersIds } });
  const newTask = await Task.create({
    ...taskBody,
    members,
    tags,
    userId: getUser.id,
  });
  const task = await newTask.save();
  return task;
};

export const updateTaskService = async (taskId, taskBody) => {
  const members = taskBody.members
    .split(",")
    .map((id) => mongoose.Types.ObjectId.createFromHexString(id.trim()));
  const tags = taskBody.tags.split(",");
  const updatedFields = { ...taskBody, members, tags };
  Object.keys(updatedFields).forEach(
    (key) =>
      updatedFields[key] === "" ||
      updatedFields[key] === null ||
      (undefined && delete updatedFields[key])
  );
  const updatedTask = await Task.findByIdAndUpdate(taskId, updatedFields, {
    new: true,
  });
  return updatedTask;
};
