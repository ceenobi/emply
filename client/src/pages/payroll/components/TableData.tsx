import { RouterLink, Texts } from "@/components";
import { PayrollProps } from "@/types/payroll";
import { formatCurrency, formatEditDate, payrollStatusColorMap } from "@/utils";
import { Avatar, Badge, Table, Tooltip } from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import PayrollDetail from "./PayrollDetail";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";

const columns = [
  { name: "EMPLOYEE", uid: "employee" },
  { name: "SALARY", uid: "salary" },
  { name: "ALLOWANCE", uid: "allowance" },
  { name: "DEDUCTIONS", uid: "deductions" },
  { name: "TAX", uid: "tax" },
  { name: "LATE", uid: "late" },
  { name: "LWP", uid: "lwp" },
  { name: "NET PAY", uid: "netPay" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type PayrollUserProps = {
  payroll: PayrollProps[];
  selectQuery?: string;
};
export default function TableData({ payroll, selectQuery }: PayrollUserProps) {
  const [openCard, setOpenCard] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollProps | null>(
    null
  );
  const { user: loggedInUser } = useAuthProvider() as { user: Userinfo };

  const handleOpenCard = (employee: PayrollProps) => {
    setSelectedEmployee(employee);
    setOpenCard(true);
  };

  const renderCell = useCallback(
    (user: PayrollProps, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof PayrollProps];
      switch (columnKey) {
        case "employee":
          return (
            <div className="flex items-center gap-2">
              <Avatar
                size="3"
                src={user?.userId?.photo}
                fallback={user?.userId?.firstName.slice(0, 1) as string}
                variant="soft"
              />
              <div className="flex flex-col">
                <Texts
                  className="font-bold text-sm mb-0"
                  text={user?.userId?.firstName + " " + user?.userId?.lastName}
                />
                <Texts text={user?.employeeId} className="text-sm" />
              </div>
            </div>
          );
        case "salary":
          return (
            <div className="flex flex-col">
              <Texts
                text={formatCurrency(user.salary)}
                className="text-sm capitalize"
              />
            </div>
          );
        case "allowance":
          return (
            <div className="flex flex-col">
              <Texts
                text={formatCurrency(user.allowance || 0)}
                className="text-sm capitalize"
              />
            </div>
          );
        case "deductions":
          return (
            <div className="flex flex-col">
              <Texts
                text={formatCurrency(user.deductions || 0)}
                className="text-sm capitalize"
              />
            </div>
          );
        case "tax":
          return (
            <div className="flex flex-col">
              <Texts
                text={`${user.tax || 0}%`}
                className="text-sm capitalize"
              />
            </div>
          );
        case "late":
          return (
            <div className="flex flex-col">
              <Texts text={`${user.lateDays}`} className="text-sm capitalize" />
            </div>
          );
        case "lwp":
          return (
            <div className="flex flex-col">
              <Texts
                text={`${user.lwp === null ? 0 : user.lwp}`}
                className="text-sm capitalize"
              />
            </div>
          );
        case "netPay":
          return (
            <div className="flex flex-col">
              <Texts
                text={formatCurrency(user.net)}
                className="text-sm capitalize"
              />
            </div>
          );
        case "status":
          return (
            <Badge
              size="3"
              variant="soft"
              color={
                payrollStatusColorMap[
                  user.status as keyof typeof payrollStatusColorMap
                ]
              }
            >
              {cellValue as React.ReactNode}
            </Badge>
          );
        case "actions":
          return (
            <>
              <div className="relative flex items-center gap-2">
                <Tooltip content="View profile">
                  <div>
                    <RouterLink
                      to={`/employees/${user?.userId?.firstName.toLowerCase()}/${user.employeeId}`}
                      className="text-lg text-sky-600 cursor-pointer active:opacity-50"
                      text={<FaEye />}
                    />
                  </div>
                </Tooltip>
                <Tooltip content="Edit payroll">
                  <div>
                    <RouterLink
                      text={<FaEdit />}
                      to={`/payroll/${user?.userId?.firstName.toLowerCase()}/${user?.employeeId}/${formatEditDate(user?.payrollDate as string)}`}
                      className="text-lg text-teal-300 cursor-pointer active:opacity-50"
                    />
                  </div>
                </Tooltip>
                {loggedInUser.role.includes("super-admin") && (
                  <Tooltip content="Toggle payment status">
                    <div>
                      <TbReportMoney
                        role="button"
                        className="text-lg text-red-400 cursor-pointer active:opacity-50"
                        onClick={() => handleOpenCard(user)}
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
              <PayrollDetail
                setOpenCard={setOpenCard}
                openCard={openCard}
                selectedEmployee={selectedEmployee}
              />
            </>
          );
      }
    },
    [loggedInUser.role, openCard, selectedEmployee]
  );

  return (
    <Table.Root layout="auto" variant="surface" size="1">
      <Table.Header>
        <Table.Row>
          {columns.map((item) => (
            <Table.ColumnHeaderCell key={item.uid}>
              {item.name}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {payroll
          ?.filter((query: PayrollProps) =>
            !selectQuery || selectQuery === "all"
              ? query
              : query.status === selectQuery
          )
          .map((user: PayrollProps) => (
            <Table.Row key={user._id} align="center">
              {columns.map((column) => (
                <Table.Cell key={column.uid}>
                  {renderCell(user, column.uid)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
}
