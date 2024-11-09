import {
  DataSpinner,
  Headings,
  Page,
  Paginate,
  PayrollCard,
  RouterLink,
  Texts,
} from "@/components";
import { PayrollProps } from "@/types/payroll";
import { Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  Await,
  Outlet,
  useLoaderData,
  useMatch,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import TableData from "./components/TableData";
import { formatEditDate, payrollStatusColorMap } from "@/utils";
import { Badge, Select } from "@radix-ui/themes";

export default function Payroll() {
  const [selectQuery, setSelectQuery] = useState<string | undefined>("all");
  const match = useMatch("/payroll");
  const { data } = useLoaderData() as { data: PayrollProps };
  const navigation = useNavigation();
  const navigate = useNavigate();

  const handleFilterQuery = (query: string) => {
    setSelectQuery(query);
  };

  const searchPayrollFilterQuery = (query: string) => {
    const nn = query
    setSelectQuery(nn as string);
    navigate(`/payroll/search?query=${nn}`);
  };
  
  return (
    <>
      <Helmet>
        <title>Settings - Employees payroll, salaries view.</title>
        <meta name="description" content="Salary overview" />
      </Helmet>
      <Page>
        {match ? (
          <>
            <div className="flex justify-between items-center">
              <Headings text="Payroll" header={true} />
              <RouterLink
                to="/payroll/create"
                className="text-md font-semibold text-sky-100"
                text={
                  <button className="flex justify-center items-center gap-2 w-[140px] md:h-[36px] bg-sky-300 rounded-md">
                    <AiOutlinePlusCircle />
                    Create
                  </button>
                }
              />
            </div>
            <div className="mt-8">
              {navigation.state === "loading" ? (
                <DataSpinner />
              ) : (
                <Suspense fallback={<DataSpinner />}>
                  <Await
                    resolve={data}
                    errorElement={
                      <Texts className="mt-8" text="Error loading data" />
                    }
                  >
                    {(resolvedData) => (
                      <>
                        {resolvedData.data.payroll.length > 0 ? (
                          <>
                            <PayrollCard
                              totalNetPay={resolvedData.data.totalNetPay}
                              totalAllowance={resolvedData.data.totalAllowance}
                              totalDeductions={
                                resolvedData.data.totalDeductions
                              }
                            />
                            <div className="mt-8 flex flex-wrap  gap-4 justify-between items-center">
                              <div className="flex flex-wrap gap-3 items-center">
                                {Object.keys(payrollStatusColorMap).map(
                                  (status) => (
                                    <Badge
                                      key={status}
                                      size="3"
                                      variant="soft"
                                      color={
                                        selectQuery === status
                                          ? payrollStatusColorMap[status]
                                          : "gray"
                                      }
                                      className="cursor-pointer hover:font-semibold capitalize"
                                      onClick={() => handleFilterQuery(status)}
                                    >
                                      {status}
                                    </Badge>
                                  )
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 items-center">
                                <Texts
                                  text="Sort dates:"
                                  className="font-semibold"
                                />
                                <Select.Root
                                  size="2"
                                  value={selectQuery}
                                  onValueChange={searchPayrollFilterQuery}
                                  defaultValue="Payroll Date"
                                >
                                  <Select.Trigger
                                    variant="soft"
                                    placeholder="Payroll Date"
                                  />
                                  <Select.Content>
                                    {resolvedData.data.payrollDate
                                      .filter(
                                        (item: string, index: number) =>
                                          index ===
                                          resolvedData.data.payrollDate.indexOf(
                                            item
                                          )
                                      )
                                      .map((item: string, index: number) => (
                                        <Select.Item value={item} key={index}>
                                          {formatEditDate(item)}
                                        </Select.Item>
                                      ))}
                                  </Select.Content>
                                </Select.Root>
                              </div>
                            </div>
                            <div className="mt-4 overflow-x-auto overflow-y-hidden md:overflow-hidden">
                              <TableData
                                payroll={resolvedData.data.payroll}
                                selectQuery={selectQuery}
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
                            text="There are no payrolls yet available"
                          />
                        )}
                      </>
                    )}
                  </Await>
                </Suspense>
              )}
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </Page>
    </>
  );
}
