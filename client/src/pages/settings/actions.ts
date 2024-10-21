import { authService, employeeService } from "@/api";
import { UpdateProfileProps } from "@/types/user";
import { handleError } from "@/utils";

export const changePasswordAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  try {
    const user = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
    };
    const res = await authService.changePassword({ user });
    return res;
  } catch (error: unknown) {
    handleError(error);
  }
  return null;
};

export const updateProfileAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const updateBody = Object.fromEntries(formData);
  try {
    const res = await employeeService.updateEmployeeProfile(
      updateBody.employeeId as string,
      updateBody as unknown as UpdateProfileProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
