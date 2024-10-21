import { leaveService } from "@/api";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
export const getEmployeeLeaves = async () => {
  return await queryClient.fetchQuery({
    queryKey: ["leaves"],
    queryFn: leaveService.getUserLeaves,
  });
};
export const getAllLeaves = async (page: string | number) => {
  return await queryClient.fetchQuery({
    queryKey: ["allLeaves", page],
    queryFn: () => leaveService.getAllLeaves(page),
  });
};

export const searchLeaves = async (
  searchQuery: string,
  page: string | number
) => {
  return await queryClient.fetchQuery({
    queryKey: ["searchLeaves", searchQuery, page],
    queryFn: () => leaveService.searchLeaves(searchQuery, page),
  });
};
