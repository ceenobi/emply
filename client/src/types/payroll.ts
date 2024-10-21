export type PayrollProps = {
  length: number;
  _id: string;
  employeeId: string;
  status: string;
  salary: number;
  allowance?: number;
  deductions?: number;
  isPaid: boolean;
  tax: number;
  net: number;
  startDate: number;
  lateDays: number;
  lwp?: number;
  payrollDate?: string;
  paymentDate?: string;
  comment?: string;
  userId?: {
    _id?: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
};
