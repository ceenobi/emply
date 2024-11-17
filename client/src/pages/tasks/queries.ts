import { QueryClient } from "@tanstack/react-query";
import { taskService } from "@/api";

const queryClient = new QueryClient();

export const getTasks = async (page: string | number) => {
  return await queryClient.fetchQuery({
    queryKey: ["tasks", page],
    queryFn: () => taskService.getAllTask(page),
  });
};
export const getATask = async (taskId: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskService.getATask(taskId),
  });
};
