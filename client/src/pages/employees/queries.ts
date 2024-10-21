import { QueryClient } from "@tanstack/react-query";
import { deptService, employeeService } from "@/api";

const queryClient = new QueryClient();
export const getAllEmployees = async (page: string | number) => {
  return await queryClient.fetchQuery({
    queryKey: ["employees", page],
    queryFn: () => employeeService.getAllEmployees(page),
  });
};

export const getAnEmployee = async (firstName: string, employeeId: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["employee", firstName, employeeId],
    queryFn: () => employeeService.getAnEmployee(firstName, employeeId),
  });
};

export const searchEmployees = async (
  searchQuery: string,
  page: string | number
) => {
  return await queryClient.fetchQuery({
    queryKey: ["searchEmployees", searchQuery, page],
    queryFn: () => employeeService.searchEmployees(searchQuery, page),
  });
};
export const getDepartments = async () => {
  return await queryClient.fetchQuery({
    queryKey: ["departments"],
    queryFn: deptService.getDepartments,
  });
};
