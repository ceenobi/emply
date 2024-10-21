import { http } from "@/utils";
import { UserAuthFormProps } from "@/types/user";

const register = async (formData: UserAuthFormProps) => {
  return await http.post("/auth/register", formData);
};
const login = async (formData: UserAuthFormProps) => {
  return await http.post("/auth/login", formData);
};
const verifyUserEmail = async (code: string) => {
  return await http.post("/auth/verify-email", { code });
};
const forgotPassword = async (email: string) => {
  return http.post("/auth/forgot-password", email);
};
const resetPassword = async (token: string, password: string) => {
  return http.post(`/auth/reset-password/${token}`, { password });
};
const changePassword = async (formData: {
  user: { currentPassword: string; newPassword: string };
}) => {
  return http.post(`/auth/update-password`, formData);
};
const getAuthenticatedUser = async () => {
  return http.get("/auth");
};
const logoutUser = async () => {
  return await http.post("/auth/logout");
};
const deleteAccount = async () => {
  return await http.delete("/auth/delete-account");
};
const adminDeleteAccount = async (employeeId: string) => {
  return await http.delete(`/auth/${employeeId}/delete-account`);
};

export default {
  register,
  getAuthenticatedUser,
  login,
  logoutUser,
  forgotPassword,
  changePassword,
  resetPassword,
  verifyUserEmail,
  deleteAccount,
  adminDeleteAccount,
};
