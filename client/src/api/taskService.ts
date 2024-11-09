import { TaskData } from "@/types/task";
import { http } from "@/utils";
const createTask = async (formData: TaskData) => {
  return await http.post("/tasks/create", formData);
};

export default { createTask };
