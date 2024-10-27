import { Headings, RouterLink, Texts } from "@/components";
import Page from "@/components/Page";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Await, Outlet, useLoaderData, useMatch } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { DataSpinner } from "@/components/Spinner";
import TableData from "./components/TableData";
import Paginate from "@/components/Paginate";
import { Button, Select } from "@radix-ui/themes";
import {
  employeeDept,
  employeeRole,
  employeeStatus,
  selectJobTitle,
} from "@/utils";

export function Component() {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [dept, setDept] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { user } = useAuthProvider() as { user: Userinfo };
  const match = useMatch("/employees");
  const { data } = useLoaderData() as { data: Userinfo };
  const roles = ["admin", "super-admin"];
  const resetFilter = () => {
    setDept("");
    setRole("");
    setStatus("");
    setJobTitle("");
  };

  return (
    <>
      <Helmet>
        <title>EMPLY | Employees</title>
        <meta name="description" content="View all employees" />
      </Helmet>
      <Page>
        {match ? (
          <>
            <div className="flex justify-between items-center">
              <Headings text="Employees" header={true} />
              {roles.includes(user.role) && (
                <RouterLink
                  to="/employees/register"
                  className="text-sm font-semibold text-sky-100"
                  text={
                    <button className="flex justify-center items-center gap-2 w-[140px] h-[36px] bg-sky-300 rounded-md">
                      <AiOutlinePlusCircle />
                      Add
                    </button>
                  }
                />
              )}
            </div>
            <div className="mt-6">
              <Suspense fallback={<DataSpinner />}>
                <Await
                  resolve={data}
                  errorElement={
                    <Texts className="mt-8" text="Error loading data" />
                  }
                >
                  {(resolvedData) => (
                    <>
                      {resolvedData.data.employees.length > 0 ? (
                        <>
                          <div className="flex flex-wrap justify-between items-center ">
                            <div className="flex flex-wrap gap-6">
                              <Texts
                                text="filters:"
                                className="font-semibold"
                              />
                              <Select.Root
                                size="2"
                                value={jobTitle}
                                onValueChange={setJobTitle}
                              >
                                <Select.Trigger
                                  variant="soft"
                                  placeholder="Job title"
                                />
                                <Select.Content>
                                  {selectJobTitle.map((item) => (
                                    <Select.Item
                                      value={item.name}
                                      key={item._id}
                                    >
                                      {item.name}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                              <Select.Root
                                size="2"
                                value={role}
                                onValueChange={setRole}
                              >
                                <Select.Trigger
                                  variant="soft"
                                  placeholder="Job role"
                                />
                                <Select.Content>
                                  {employeeRole.map((item) => (
                                    <Select.Item
                                      value={item.name}
                                      key={item._id}
                                    >
                                      {item.name}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                              <Select.Root
                                size="2"
                                value={dept}
                                onValueChange={setDept}
                              >
                                <Select.Trigger
                                  variant="soft"
                                  placeholder="Department"
                                />
                                <Select.Content>
                                  {employeeDept.map((item) => (
                                    <Select.Item
                                      value={item.name}
                                      key={item._id}
                                    >
                                      {item.name}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                              <Select.Root
                                size="2"
                                value={status}
                                onValueChange={setStatus}
                              >
                                <Select.Trigger
                                  variant="soft"
                                  placeholder="Status"
                                />
                                <Select.Content>
                                  {employeeStatus.map((item) => (
                                    <Select.Item
                                      value={item.name}
                                      key={item._id}
                                    >
                                      {item.name}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                              <Button
                                onClick={resetFilter}
                                variant="soft"
                                color="crimson"
                              >
                                Reset
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 w-full overflow-x-auto overflow-y-hidden md:overflow-hidden">
                            <TableData
                              employees={resolvedData.data.employees}
                              jobTitle={jobTitle}
                              role={role}
                              dept={dept}
                              status={status}
                            />
                            <Paginate
                              totalPages={resolvedData.data.totalPages}
                              count={resolvedData.data.count}
                            />
                          </div>
                        </>
                      ) : (
                        <Texts
                          className="mt-8"
                          text="There are no employees to display"
                        />
                      )}
                    </>
                  )}
                </Await>
              </Suspense>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </Page>
    </>
  );
}

Component.displayName = "Employees";
