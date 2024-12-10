import { DataSpinner, Headings, Page, RouterLink, Texts } from "@/components";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { TaskData } from "@/types/task";
import { Helmet } from "react-helmet-async";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Outlet, useMatch, useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";
import Planned from "./components/Planned";
import InProgress from "./components/InProgress";
import Completed from "./components/Completed";
import Postponed from "./components/Postponed";

export function Component() {
  const { user } = useAuthProvider() as { user: Userinfo };
  const { data } = useLoaderData() as { data: TaskData };
  const match = useMatch("/tasks");
  const roles = ["admin", "super-admin"];

  return (
    <>
      <Helmet>
        <title>
          Tasks - Create and manage your tasks, assign members to teams.
        </title>
        <meta name="description" content="View all tasks" />
      </Helmet>
      <Page>
        {match ? (
          <>
            <div className="flex justify-between items-center">
              <Headings text="Tasks" header={true} />
              {roles.includes(user.role) && (
                <RouterLink
                  to="/tasks/create"
                  className="text-sm font-semibold text-sky-100"
                  text={
                    <button className="flex justify-center items-center gap-2 w-[140px] md:h-[36px] bg-sky-300 rounded-md">
                      <AiOutlinePlusCircle />
                      Create
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
                    <div className="md:grid md:grid-cols-2 lg:grid-cols-4 justify-between gap-4">
                      <Planned data={resolvedData} />
                      <InProgress data={resolvedData} />
                      <Completed data={resolvedData} />
                      <Postponed data={resolvedData} />
                    </div>
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

Component.displayName = "Tasks";
