import { RouterLink, Texts } from "@/components";
import { AlertBox } from "@/components/ModalBox";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { employeeStatusColorMap } from "@/utils";
import { Avatar, Badge, Table, Tooltip } from "@radix-ui/themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin6Line, RiErrorWarningFill } from "react-icons/ri";
import { useNavigate, useFetcher } from "react-router-dom";
import { toast } from "sonner";

const columns = [
  { name: "EMPLOYEE", uid: "employee" },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "DEPT", uid: "dept" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type EmployeeProps = {
  employees: Userinfo[];
  jobTitle?: string;
  role?: string;
  dept?: string;
  status?: string;
};

export default function TableData({
  employees,
  jobTitle,
  role,
  dept,
  status,
}: EmployeeProps) {
  const [openCard, setOpenCard] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Userinfo | null>(null);
  const { user: userId } = useAuthProvider() as { user: Userinfo };
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher && fetcher.data && fetcher.data?.status === 200) {
      toast.success(fetcher.data.data as string, {
        id: "delete-employee-success",
      });
      setOpenCard(false);
      navigate("/employees");
    }
  }, [navigate, fetcher]);

  const handleDeleteClick = (user: Userinfo) => {
    setSelectedUser(user);
    setOpenCard(true);
  };

  const deleteEmployee = useCallback(
    async (id: string) => {
      fetcher.submit(
        { id: id as string },
        {
          method: "delete",
          action: "/employees",
        }
      );
    },
    [fetcher]
  );

  const renderCell = useCallback(
    (user: Userinfo, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Userinfo];

      switch (columnKey) {
        case "employee":
          return (
            <div className="flex items-center gap-2">
              <Avatar
                size="3"
                src={user?.photo}
                fallback={user?.firstName.slice(0, 1)}
                variant="soft"
              />
              <div className="flex flex-col">
                <Texts
                  className="font-bold text-sm mb-0"
                  text={user?.firstName + " " + user?.lastName}
                />
                <Texts
                  className="capitalize"
                  text={user?.jobTitle || user?.role}
                />
              </div>
            </div>
          );
        case "dept":
          return (
            <div className="flex flex-col">
              <Texts text={user.dept} className="text-sm capitalize" />
            </div>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <Texts text={user.role} className="text-sm capitalize" />
            </div>
          );
        case "status":
          return (
            <Badge
              size="3"
              variant="soft"
              color={
                employeeStatusColorMap[
                  user.status as keyof typeof employeeStatusColorMap
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
                      to={`/employees/${user.firstName.toLowerCase()}/${user.employeeId}`}
                      className="text-lg text-sky-600 cursor-pointer active:opacity-50"
                      text={<FaEye />}
                    />
                  </div>
                </Tooltip>
                {["admin", "super-admin"].includes(userId.role) && (
                  <Tooltip content="Edit profile">
                    <div>
                      <RouterLink
                        to={`/employees/edit/${user.firstName.toLowerCase()}/${user.employeeId}`}
                        className="text-lg text-teal-300 cursor-pointer active:opacity-50"
                        text={<FaEdit />}
                      />
                    </div>
                  </Tooltip>
                )}
                {["admin", "super-admin"].includes(userId.role) && (
                  <AlertBox
                    title={
                      <div className="flex gap-1 items-center">
                        <RiErrorWarningFill
                          size="28px"
                          className="text-red-400"
                        />
                        <div>Warning</div>
                      </div>
                    }
                    onClick={() => deleteEmployee(selectedUser?._id as string)}
                    isSubmitting={isSubmitting}
                    disabled={isSubmitting}
                    open={openCard}
                    setOpen={setOpenCard}
                    trigger={
                      <Tooltip content="Delete user">
                        <div>
                          <RiDeleteBin6Line
                            role="button"
                            className="text-red-400  cursor-pointer active:opacity-50"
                            onClick={() => handleDeleteClick(user)}
                          />
                        </div>
                      </Tooltip>
                    }
                  >
                    <fetcher.Form method="delete" action="/employees">
                      <div className="text-center text-lg">
                        <div>
                          Are you sure you want to delete? <br />
                          <div className="font-bold">
                            {selectedUser?.firstName.concat(
                              " ",
                              selectedUser?.lastName
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-center">
                          This action is permanent and cannot be reversed{" "}
                        </div>
                      </div>
                    </fetcher.Form>
                  </AlertBox>
                )}
              </div>
            </>
          );
        default:
          return cellValue;
      }
    },
    [
      deleteEmployee,
      fetcher,
      isSubmitting,
      openCard,
      selectedUser?._id,
      selectedUser?.firstName,
      selectedUser?.lastName,
      userId.role,
    ]
  );

  const filteredEmployees = useMemo(() => {
    if (!jobTitle && !role && !dept && !status) {
      return employees;
    }
    const filtered = employees.filter((employee: Userinfo) => {
      const matchesJobTitle = jobTitle ? employee.jobTitle === jobTitle : true;
      const matchesRole = role ? employee.role === role : true;
      const matchesDept = dept ? employee.dept === dept : true;
      const matchesStatus = status ? employee.status === status : true;

      return matchesJobTitle && matchesRole && matchesDept && matchesStatus;
    });
    return filtered;
  }, [dept, employees, jobTitle, role, status]);

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
          {filteredEmployees.map((user: Userinfo) => (
            <Table.Row key={user._id} align="center">
              {columns.map((column) => (
                <Table.Cell key={column.uid}>
                  {renderCell(user, column.uid) as string}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
