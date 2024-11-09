export type TaskData = {
  _id: string;
  title: string;
  description: string;
  members: string[];
  startDate: string;
  endDate?: string;
  status: string;
  tags: string[];
};
