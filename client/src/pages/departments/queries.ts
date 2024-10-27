import { QueryClient } from "@tanstack/react-query";
import { deptService, employeeService } from "@/api";

const queryClient = new QueryClient();
export const getEmployeesByDept = async (
  dept: string,
  page: string | number
) => {
  return await queryClient.fetchQuery({
    queryKey: ["employeesByDept", dept, page],
    queryFn: () => employeeService.getEmployeesByDept(dept, page),
  });
};
export const getADepartment = async (deptName: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["department", deptName],
    queryFn: () => deptService.getADepartment(deptName),
  });
};
export const getDepartments = async () => {
  return await queryClient.fetchQuery({
    queryKey: ["departments"],
    queryFn: () => deptService.getDepartments(),
  });
};
