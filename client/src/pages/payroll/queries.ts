import { QueryClient } from "@tanstack/react-query";
import { payrollService } from "@/api";

const queryClient = new QueryClient();
export const getAllPayroll = async (page: string | number) => {
  return await queryClient.fetchQuery({
    queryKey: ["employeesPayroll", page],
    queryFn: () => payrollService.getAllPayroll(page),
  });
};
export const getAPayroll = async (
  firstName: string,
  employeeId: string,
  payrollDate: string
) => {
  return await queryClient.fetchQuery({
    queryKey: ["employeePayroll", firstName, employeeId, payrollDate],
    queryFn: () =>
      payrollService.getAPayroll(firstName, employeeId, payrollDate),
  });
};

export const searchPayroll = async (
  searchQuery: string,
  page: string | number
) => {
  return await queryClient.fetchQuery({
    queryKey: ["searchPayroll", searchQuery, page],
    queryFn: () => payrollService.searchPayroll(searchQuery, page),
  });
};
