import { TaskData } from "@/types/task";
import { http } from "@/utils";
const createTask = async (formData: TaskData) => {
  return await http.post("/tasks/create", formData);
};
const getAllTask = async (page: string | number) => {
  return await http.get(`/tasks/?page=${page}`);
};
const getATask = async (taskId: string) => {
  return await http.get(`/tasks/${taskId}`);
};
const updateATask = async (taskId: string, formData: TaskData) => {
  return await http.patch(`/tasks/${taskId}`, formData);
};
const deleteATask = async (taskId: string) => {
  return await http.delete(`/tasks/${taskId}`);
};

export default { createTask, getAllTask, getATask, updateATask, deleteATask };
