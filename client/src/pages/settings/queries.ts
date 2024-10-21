import { QueryClient } from "@tanstack/react-query";
import { payrollService } from "@/api";

const queryClient = new QueryClient();
export const getEmployeePayrollHistory = async (
  firstName: string,
  employeeId: string,
  page: string | number
) => {
  return await queryClient.fetchQuery({
    queryKey: ["employeePayrollHistory", firstName, employeeId, page],
    queryFn: () =>
      payrollService.getEmployeePayrollHistory(firstName, employeeId, page),
  });
};
export const trackPayrollStatus = async (
  firstName: string,
  employeeId: string
) => {
  return await queryClient.fetchQuery({
    queryKey: ["trackPayrollStatus", firstName, employeeId],
    queryFn: () => payrollService.trackPayrollStatus(firstName, employeeId),
  });
};
