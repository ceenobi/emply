import { DataSpinner, Headings, Page, RouterLink, Texts } from "@/components";
import { useAuthProvider } from "@/store";
import { LeaveProps } from "@/types/leave";
import { Userinfo } from "@/types/user";
import React, { Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Await, Outlet, useLoaderData, useMatch } from "react-router-dom";
import LeaveCard from "./components/LeaveCard";
import EditLeave from "./components/EditLeave";
import { leaveStatusColorMap } from "@/utils";
import { Badge } from "@radix-ui/themes";

export function Component() {
  const [active, setActive] = useState(0);
  const [openCard, setOpenCard] = useState(false);
  const [selectQuery, setSelectQuery] = useState<string | undefined>("all");
  const { user } = useAuthProvider() as { user: Userinfo };
  const match = useMatch("/leaves");
  const { data } = useLoaderData() as { data: LeaveProps };

  const handleFilterQuery = (query: string) => {
    setSelectQuery(query);
  };

  return (
    <>
      <Helmet>
        <title>Leave board. Apply for leave</title>
        <meta name="description" content="View your leave requests" />
      </Helmet>
      <Page>
        {match ? (
          <>
            <div className="flex justify-between items-center">
              <Headings text="Leaves" header={true} className="mb-4" />
              <RouterLink
                to="/leaves/apply"
                className="text-md font-semibold text-sky-100"
                text={
                  <button className="flex justify-center items-center gap-2 w-[140px] md:h-[36px] bg-sky-300 rounded-md">
                    <AiOutlinePlusCircle />
                    Apply
                  </button>
                }
              />
            </div>
            <div className="flex flex-wrap justify-between items-center text-center mb-4">
              <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-4 md:mb-0">
                <Texts
                  text={
                    <div>
                      Leave balance:{" "}
                      <span className="font-bold text-sky-300">
                        {user.leaveCount}
                      </span>
                    </div>
                  }
                  className="text-sky-300 mt-3"
                />
                {["admin", "super-admin"].includes(user.role) && (
                  <RouterLink
                    text={
                      <div className="flex items-center">
                        Approve leave requests
                        <IoIosArrowRoundForward />
                      </div>
                    }
                    to="/leaves/all"
                    className={`mt-3 text-sky-300 hover:font-semibold`}
                  />
                )}
              </div>
             
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
                      {resolvedData.data?.length > 0 ? (
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
                          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                            {resolvedData.data
                              ?.filter((leave: LeaveProps) =>
                                !selectQuery || selectQuery === "all"
                                  ? leave
                                  : leave.status === selectQuery
                              )
                              .map((leave: LeaveProps, index: number) => (
                                <React.Fragment key={leave._id}>
                                  <LeaveCard
                                    leave={leave}
                                    setOpenCard={setOpenCard}
                                    setActive={setActive}
                                    index={index}
                                  />
                                  <>
                                    {index === active && (
                                      <EditLeave
                                        leave={leave}
                                        setOpenCard={setOpenCard}
                                        openCard={openCard}
                                      />
                                    )}
                                  </>
                                </React.Fragment>
                              ))}
                          </div>
                        </>
                      ) : (
                        <Texts
                          className="mt-8"
                          text="You have no leave requests"
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

Component.displayName = "Leaves";
