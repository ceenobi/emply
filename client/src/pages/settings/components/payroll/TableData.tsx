import { Texts } from "@/components";
import { PayrollProps } from "@/types/payroll";
import { formatCurrency, formatEditDate, payrollStatusColorMap } from "@/utils";
import { Badge, Table, Tooltip } from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { TbReportMoney } from "react-icons/tb";
import PayrollEmpDetail from "./PayrollDetail";

type PayrollUserProps = {
  payroll: PayrollProps[];
};

const columns = [
  { name: "SALARY", uid: "salary" },
  { name: "ALLOWANCE", uid: "allowance" },
  { name: "DEDUCTIONS", uid: "deductions" },
  { name: "TAX", uid: "tax" },
  { name: "LATE", uid: "late" },
  { name: "LWP", uid: "lwp" },
  { name: "NET PAY", uid: "netPay" },
  { name: "PAY DATE", uid: "payDate" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];
export default function TableData({ payroll }: PayrollUserProps) {
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<PayrollProps | null>(null);

  const handleOpenCard = (data: PayrollProps) => {
    setSelectedData(data);
    setOpenCard(true);
  };

  const renderCell = useCallback(
    (user: PayrollProps, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof PayrollProps];
      switch (columnKey) {
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
        case "payDate":
          return (
            <div className="flex flex-col">
              <Texts
                text={
                  formatEditDate(user.paymentDate as string) || "unavailable"
                }
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
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="View extra">
                <div>
                  <TbReportMoney
                    role="button"
                    className="text-lg text-center text-red-400 cursor-pointer active:opacity-50"
                    onClick={() => handleOpenCard(user)}
                  />
                </div>
              </Tooltip>
              <PayrollEmpDetail
                setOpenCard={setOpenCard}
                openCard={openCard}
                selectedData={selectedData}
              />
            </div>
          );
      }
    },
    [openCard, selectedData]
  );

  return (
    <>
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
          {payroll.map((user: PayrollProps) => (
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
    </>
  );
}
