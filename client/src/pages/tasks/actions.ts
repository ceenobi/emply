import { taskService } from "@/api";
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

export const updateTaskAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const taskBody = Object.fromEntries(formData);
  try {
    const res = await taskService.updateATask(
      taskBody.id as string,
      taskBody as unknown as TaskData
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
export const deleteTaskAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const taskBody = Object.fromEntries(formData);
  try {
    const res = await taskService.deleteATask(taskBody.id as string);
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
