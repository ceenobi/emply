import taskService from "@/api/taskService";
import { TaskData } from "@/types/task";
import { handleError } from "@/utils";

export const createTaskAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const taskBody = Object.fromEntries(formData);
  try {
    const res = await taskService.createTask(taskBody as unknown as TaskData);
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
