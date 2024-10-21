import { UpdateProfileProps } from "@/types/user";
import { http } from "@/utils";

const getAllEmployees = async (page: string | number) => {
  return await http.get(`/users?page=${page}`);
};
const getAnEmployee = async (firstName: string, employeeId: string) => {
  return await http.get(`/users/${firstName}/${employeeId}`);
};

const updateEmployeeProfile = async (
  employeeId: string,
  formData: UpdateProfileProps
) => {
  return await http.patch(`/users/profile-update/${employeeId}`, formData);
};

const searchEmployees = async (searchQuery: string, page: string | number) => {
  return await http.get(`/users/search?q=${searchQuery}&page=${page}`);
};

export default {
  getAllEmployees,
  getAnEmployee,
  updateEmployeeProfile,
  searchEmployees,
};
