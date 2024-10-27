import { DepartmentsData } from "@/types/dept";
import { http } from "@/utils";
const getDepartments = async () => {
  return await http.get("/departments");
};
const getADepartment = async (deptName: string) => {
  return await http.get(`/departments/${deptName}`);
};
const createDepartment = async (formData: DepartmentsData) => {
  return await http.post("/departments/create", formData);
};
const updateDepartment = async (
  deptId: string,
  formData: DepartmentsData
) => {
  return await http.patch(`/departments/update/${deptId}`, formData);
};

export default {
  getDepartments,
  createDepartment,
  updateDepartment,
  getADepartment,
};
