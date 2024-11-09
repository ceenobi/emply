import { Headings, Page, RouterLink } from "@/components";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { Helmet } from "react-helmet-async";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Outlet, useMatch } from "react-router-dom";

export function Component() {
  const { user } = useAuthProvider() as { user: Userinfo };
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
          </>
        ) : (
          <Outlet />
        )}
      </Page>
    </>
  );
}

Component.displayName = "Tasks";
