import { LeaveProps } from "@/types/leave";
import { http } from "@/utils";

const applyLeave = async (formData: LeaveProps) => {
  return await http.post("/leaves/apply", formData);
};
const getUserLeaves = async () => {
  return await http.get("/leaves");
};
const getAllLeaves = async (page: string | number) => {
  return await http.get(`/leaves/all?page=${page}`);
};

const updateLeave = async (leaveId: string, formData: LeaveProps) => {
  return await http.patch(`/leaves/${leaveId}/update`, formData);
};
const approveLeave = async (leaveId: string, formData: LeaveProps) => {
  return await http.patch(`/leaves/${leaveId}/approve`, formData);
};
const deleteLeave = async (leaveId: string) => {
  return await http.delete(`/leaves/${leaveId}/delete`);
};

const searchLeaves = async (searchQuery: string, page: string | number) => {
  return await http.get(`/leaves/search?q=${searchQuery}&page=${page}`);
};

export default {
  applyLeave,
  getUserLeaves,
  updateLeave,
  deleteLeave,
  getAllLeaves,
  approveLeave,
  searchLeaves,
};
