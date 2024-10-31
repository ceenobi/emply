import { Tooltip } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";
import { SiApacheopenoffice } from "react-icons/si";
import { MdLogout } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useAuthProvider, useToggleSidebar } from "@/store";
import { sidebarLinks } from "@/utils/constants";
import { RouterLink } from "@/components/RouterLink";
import { useQueryClient } from "@tanstack/react-query";
import { Userinfo } from "@/types/user";

export default function Sidebar() {
  const queryClient = useQueryClient();
  const { logout, user } = useAuthProvider() as {
    user: Userinfo;
    logout: () => void;
  };
  const { isOpenSideBar, setIsOpenSideBar, setHideSideBar } =
    useToggleSidebar() as {
      isOpenSideBar: boolean;
      setIsOpenSideBar: (isOpen: boolean) => void;
      setHideSideBar: (hide: boolean) => void;
    };

  const mainLinks = [
    "Dashboard",
    "Tasks",
    "Departments",
    "Employees",
    "Events",
    "Leaves",
    "Payroll",
  ];

  const authRole = ["admin", "super-admin"];

  const handleToggle = () => {
    setIsOpenSideBar(!isOpenSideBar);
    setHideSideBar(false);
  };

  const handleLogout = () => {
    queryClient.clear();
    localStorage.clear();
    logout();
  };

  return (
    <div className="p-[8px]">
      <div
        className={`${isOpenSideBar ? "w-[60px] lg:w-[220px]" : "w-[60px]"} mx-auto p-2 rounded-lg bg-sky-300`}
      >
        <RouterLink
          to="/"
          className="text-2xl font-bold hidden lg:block px-2"
          text={
            isOpenSideBar ? (
              <div className="flex items-center gap-2 text-sky-100">
                <SiApacheopenoffice /> EMPLY
              </div>
            ) : (
              <SiApacheopenoffice className="text-sky-100" />
            )
          }
        />
        <div className="mt-6">
          {sidebarLinks
            .filter((item) =>
              authRole.includes(user.role)
                ? mainLinks.includes(item.name) || item.name === "Payroll"
                : mainLinks.includes(item.name) && item.name !== "Payroll"
            )
            .map(({ id, Icon, name, path }) => (
              <Tooltip
                content={isOpenSideBar ? undefined : name}
                className={isOpenSideBar ? "hidden" : ""}
                key={id}
                side="right"
              >
                <NavLink to={`${path}`}>
                  {({ isActive }) => (
                    <span
                      className={`flex items-center my-2 p-2 hover:bg-red-400 hover:rounded-md hover:transition duration-150 ease-out hover:ease-in gap-2 hover:text-sky-300
                         ${isActive ? "bg-cream-100 text-sky-300 w-full rounded-md" : "text-sky-100"}`}
                    >
                      <Icon
                        size="1.5rem"
                        className={`${isOpenSideBar ? "" : "mx-1"}`}
                      />
                      <div
                        className={`font-semibold text-lg ${isOpenSideBar ? "hidden lg:block" : "hidden"}`}
                      >
                        {name}
                      </div>
                    </span>
                  )}
                </NavLink>
              </Tooltip>
            ))}
          <hr className="text-white my-3" />
          <>
            {sidebarLinks
              .filter((item) => item.name === "Settings")
              .map(({ id, Icon, name, path }) => (
                <Tooltip
                  content={isOpenSideBar ? undefined : name}
                  className={isOpenSideBar ? "hidden" : ""}
                  key={id}
                  side="right"
                >
                  <NavLink to={`${path}`}>
                    {({ isActive }) => (
                      <span
                        className={`flex items-center my-2 p-2 hover:bg-red-400 hover:rounded-md hover:transition duration-150 ease-out hover:ease-in gap-2 hover:text-sky-300 ${isActive ? "bg-cream-100  text-sky-300 w-full rounded-md" : "text-sky-100"}`}
                      >
                        <Icon
                          size="1.5rem"
                          className={`${isOpenSideBar ? "" : "mx-1"}`}
                        />
                        <div
                          className={`font-semibold text-lg ${isOpenSideBar ? "hidden lg:block" : "hidden"}`}
                        >
                          {name}
                        </div>
                      </span>
                    )}
                  </NavLink>
                </Tooltip>
              ))}
          </>
        </div>
      </div>
      <div
        className="absolute bottom-[20px] left-[15px]
       md:flex flex-col px-2"
      >
        <Tooltip
          content={isOpenSideBar ? undefined : "Logout"}
          className={isOpenSideBar ? "hidden" : ""}
          side="right"
        >
          <div
            className="flex gap-2 text-sky-300 hover:text-red-400 hover:transition duration-150 ease-out cursor-pointer w-full mb-4"
            onClick={handleLogout}
          >
            <MdLogout size="1.5rem" role="button" />
            <span
              className={`font-semibold text-lg ${isOpenSideBar ? "hidden lg:block" : "hidden"}`}
            >
              Logout
            </span>
          </div>
        </Tooltip>
        <Tooltip
          content={isOpenSideBar ? "Collapse" : "Expand"}
          className={isOpenSideBar ? "hidden" : ""}
          side="right"
        >
          {isOpenSideBar ? (
            <div>
              <IoIosArrowBack
                onClick={handleToggle}
                size="1.5rem"
                role="button"
                aria-description="collapse sidebar"
                className="text-sky-300 hover:text-red-400 hover:transition duration-150 ease-out"
              />
            </div>
          ) : (
            <div>
              <IoIosArrowForward
                onClick={handleToggle}
                size="1.5rem"
                role="button"
                aria-description="expand sidebar"
                className="text-sky-300 hover:text-red-400 hover:transition duration-150 ease-out"
              />
            </div>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
