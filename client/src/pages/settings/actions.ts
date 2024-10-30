import { authService } from "@/api";
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
