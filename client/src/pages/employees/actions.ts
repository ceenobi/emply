import { authService } from "@/api";
import { UserAuthFormProps } from "@/types/user";
import { handleError } from "@/utils";

export const registerAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  try {
    const res = await authService.register(
      user as unknown as UserAuthFormProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};


export const deleteEmployeeAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const id = Object.fromEntries(formData);
  try {
    const res = await authService.adminDeleteAccount(id.id as string);
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
