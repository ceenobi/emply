import { PayrollProps } from "@/types/payroll";
import { http } from "@/utils";

const setPayroll = async (formData: PayrollProps) => {
  return await http.post("/payroll/set", formData);
};
const createPayroll = async (formData: PayrollProps) => {
  return await http.post("/payroll/create", formData);
};
const getAllPayroll = async (page: string | number) => {
  return await http.get(`/payroll/?page=${page}`);
};
const getAPayroll = async (
  firstName: string,
  employeeId: string,
  payrollDate: string
) => {
  return await http.get(
    `/payroll/get/${firstName}/${employeeId}/${payrollDate}`
  );
};
const trackPayrollStatus = async (firstName: string, employeeId: string) => {
  return await http.get(`/payroll/track/${firstName}/${employeeId}`);
};
const getEmployeePayrollHistory = async (
  firstName: string,
  employeeId: string,
  page: string | number
) => {
  return await http.get(
    `/payroll/history/${firstName}/${employeeId}/?page=${page} `
  );
};
const updateAPayroll = async (
  firstName: string,
  employeeId: string,
  payrollDate: string,
  formData: PayrollProps
) => {
  return await http.patch(
    `/payroll/update/${firstName}/${employeeId}/${payrollDate}`,
    formData
  );
};

const togglePayrollStatus = async (
  firstName: string,
  employeeId: string,
  payrollDate: string,
  formData: PayrollProps
) => {
  return await http.patch(
    `/payroll/status/${firstName}/${employeeId}/${payrollDate}`,
    formData
  );
};

const searchPayroll = async (searchQuery: string, page: string | number) => {
  return await http.get(`/payroll/search?q=${searchQuery}&page=${page}`);
};


export default {
  createPayroll,
  getAllPayroll,
  setPayroll,
  getAPayroll,
  updateAPayroll,
  togglePayrollStatus,
  getEmployeePayrollHistory,
  trackPayrollStatus,
  searchPayroll
};
