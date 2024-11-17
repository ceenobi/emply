export type TaskData = {
  _id: string;
  title: string;
  description: string;
  members?: {
    _id?: string;
    firstName: string;
    lastName: string;
    photo?: string;
    employeeId: string;
  };
  startDate: string;
  endDate?: string;
  status: string;
  priority: string;
  tags: string[];
  count?: number;
  totalPages?: number;
  userId?: {
    _id?: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
};
