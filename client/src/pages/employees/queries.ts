import { QueryClient } from "@tanstack/react-query";
import { employeeService } from "@/api";

const queryClient = new QueryClient();
export const getAllEmployees = async (page: string | number) => {
  return await queryClient.fetchQuery({
    queryKey: ["allEmployees", page],
    queryFn: () => employeeService.getAllEmployees(page),
  });
};
export const getEmployees = async () => {
  return await queryClient.fetchQuery({
    queryKey: ["employees"],
    queryFn: ()=>employeeService.getEmployees(),
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
