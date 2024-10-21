import { authService } from "@/api";
import { UserAuthFormProps } from "@/types/user";
import { handleError } from "@/utils";

export const loginAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  try {
    const res = await authService.login(user as unknown as UserAuthFormProps);
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const forgotPasswordAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  try {
    const res = await authService.forgotPassword(user as unknown as string);
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const resetPasswordAction = async ({
  request,
  params,
}: {
  request: Request;
  params: { token: string };
}) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  try {
    const res = await authService.resetPassword(
      params.token,
      user.password as string
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
