import { deptService } from "@/api";
import { DepartmentsData } from "@/types/dept";
import { handleError } from "@/utils";

export const createDepartmentAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const dept = Object.fromEntries(formData);
  try {
    const res = await deptService.createDepartment(
      dept as unknown as DepartmentsData
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const updateDepartmentAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const dept = Object.fromEntries(formData);
  try {
    const res = await deptService.updateDepartment(
      dept.id as string,
      dept as unknown as DepartmentsData
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
