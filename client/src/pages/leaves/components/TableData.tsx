import { RouterLink, Texts } from "@/components";
import { LeaveProps } from "@/types/leave";
import { calcLeaveDays } from "@/utils";
import { leaveStatusColorMap } from "@/utils/constants";
import { Avatar, Badge, Table, Tooltip } from "@radix-ui/themes";
import { useCallback, useMemo, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import ActionLeaveData from "./ActionLeaveData";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "TYPE", uid: "type" },
  { name: "DURATION", uid: "duration" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type EmployeeLeaveProps = {
  leaves: LeaveProps[];
  selectQuery?: string;
};

export default function TableData({ leaves, selectQuery }: EmployeeLeaveProps) {
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<LeaveProps | null>(null);

  const handleOpenCard = (leave: LeaveProps) => {
    setSelectedUser(leave);
    setOpenCard(true);
  };

  const renderCell = useCallback(
    (leave: LeaveProps, columnKey: React.Key) => {
      const cellValue = leave[columnKey as keyof LeaveProps];
      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-2">
              <Avatar
                size="3"
                src={leave?.userId?.photo}
                fallback={leave?.userId?.firstName.slice(0, 1) as string}
                variant="soft"
              />
              <div className="flex flex-col">
                <Texts
                  className="font-bold text-sm mb-0"
                  text={leave?.userId?.firstName.concat(
                    " ",
                    leave?.userId?.lastName
                  )}
                />
              </div>
            </div>
          );
        case "type":
          return (
            <div className="flex flex-col">
              <Texts
                text={leave.leaveType}
                className="text-bold text-sm capitalize"
              />
            </div>
          );
        case "duration":
          return (
            <div className="flex flex-col">
              <Texts
                text={<>{calcLeaveDays(leave)} days</>}
                className="text-bold text-sm capitalize"
              />
            </div>
          );
        case "status":
          return (
            <Badge
              size="3"
              variant="soft"
              color={
                leaveStatusColorMap[
                  leave.status as keyof typeof leaveStatusColorMap
                ]
              }
            >
              {cellValue as React.ReactNode}
            </Badge>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content={`See ${leave?.userId?.firstName}'s profile`}>
                <div>
                  <RouterLink
                    to={`/employees/${leave?.userId?.firstName.toLowerCase()}/${leave.employeeId}`}
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    text={<FaEye />}
                  />
                </div>
              </Tooltip>
              <Tooltip content="Take action">
                <div className="text-lg text-red-400 cursor-pointer active:opacity-50">
                  <FaEdit role="button" onClick={() => handleOpenCard(leave)} />
                </div>
              </Tooltip>
              <ActionLeaveData
                setOpenCard={setOpenCard}
                openCard={openCard}
                selectedUser={selectedUser}
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [openCard, selectedUser]
  );

  const filteredLeaves = useMemo(() => {
    if (!selectQuery || selectQuery === "all") {
      return leaves;
    }
    return leaves.filter((leave: LeaveProps) => {
      return leave.status === selectQuery;
    });
  }, [leaves, selectQuery]);

  return (
    <>
      <Table.Root layout="auto" variant="surface">
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
          {filteredLeaves.map((leave: LeaveProps) => (
            <Table.Row key={leave._id}>
              {columns.map((column) => (
                <Table.Cell key={column.uid}>
                  {renderCell(leave, column.uid) as string}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
