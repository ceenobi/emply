export type LeaveProps = {
  length: number;
  photo?: string;
  description: string;
  startDate: string;
  endDate: string;
  _id: string;
  employeeId?: string;
  status?: string;
  leaveType: string;
  isApproved: boolean;
  userId?: {
    _id?: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
};

