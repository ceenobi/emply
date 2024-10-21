import { payrollService } from "@/api";
import { PayrollProps } from "@/types/payroll";
import { handleError } from "@/utils";
export const createPayrollAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const payroll = Object.fromEntries(formData);
  try {
    const res = await payrollService.createPayroll(
      payroll as unknown as PayrollProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const updatePayrollAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const payroll = Object.fromEntries(formData);
  console.log(payroll);
  try {
    const res = await payrollService.updateAPayroll(
      payroll.firstName as string,
      payroll.employeeId as string,
      payroll.payrollDate as string,
      payroll as unknown as PayrollProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const togglePayrollStatusAction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const payroll = Object.fromEntries(formData);
  try {
    const res = await payrollService.togglePayrollStatus(
      payroll.firstName as string,
      payroll.employeeId as string,
      payroll.payrollDate as string,
      payroll as unknown as PayrollProps
    );
    return res;
  } catch (error) {
    handleError(error);
  }
  return null;
};
