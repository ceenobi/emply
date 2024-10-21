import { DataSpinner, Headings, Paginate, Texts } from "@/components";
import { LeaveProps } from "@/types/leave";
import { Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import TableData from "./components/TableData";
import { Badge } from "@radix-ui/themes";
import { leaveStatusColorMap } from "@/utils";

export default function AllLeaves() {
  const [selectQuery, setSelectQuery] = useState<string | undefined>("all");
  const navigate = useNavigate();
  const { data } = useLoaderData() as { data: LeaveProps };

  const handleFilterQuery = (query: string) => {
    setSelectQuery(query);
  };

  return (
    <>
      <Helmet>
        <title>All Employees Leaves - approve or cancel leave requests.</title>
        <meta name="description" content="View all employees leaves applied" />
      </Helmet>
      <IoMdArrowDropleftCircle
        className="text-2xl text-sky-300 cursor-pointer"
        role="button"
        onClick={() => navigate(-1)}
      />
      <Headings text="All leaves" header={true} className="my-8" />
      <div className="mt-6">
        <Suspense fallback={<DataSpinner />}>
          <Await
            resolve={data}
            errorElement={<Texts className="mt-8" text="Error loading data" />}
          >
            {(resolvedData) => (
              <>
                {resolvedData.data.leaves.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-3 items-center">
                      {Object.keys(leaveStatusColorMap).map((status) => (
                        <Badge
                          key={status}
                          size="3"
                          variant="soft"
                          color={
                            selectQuery === status
                              ? leaveStatusColorMap[status]
                              : "gray"
                          }
                          className="cursor-pointer hover:font-semibold capitalize"
                          onClick={() => handleFilterQuery(status)}
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 w-[100%] md:w-full overflow-x-auto overflow-y-hidden md:overflow-hidden">
                      <TableData
                        leaves={resolvedData.data.leaves}
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
                    text="There are no leaves request to display"
                  />
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}
