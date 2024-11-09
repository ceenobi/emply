import Task from "../models/task.js";
import User from "../models/user.js";

export const createTaskService = async (user, taskBody) => {
  if (!user || typeof user !== "string") {
    throw new Error("Invalid user input");
  }
  if (!taskBody || typeof taskBody !== "object") {
    throw new Error("Invalid eventBody input");
  }
  //const { title, description, startDate, endDate, status, members, tags } = taskBody;
  const getUser = await User.findById(user);
  const newTask = await Task.create({
    ...taskBody,
    userId: getUser.id,
  });
  const task = await newTask.save();
  return task;
};
