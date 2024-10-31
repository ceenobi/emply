import { DataSpinner, Headings, Page, RouterLink, Texts } from "@/components";
import { useAuthProvider } from "@/store";
import { DepartmentsData } from "@/types/dept";
import { Userinfo } from "@/types/user";
import { getRandomColor } from "@/utils/constants";
import { Card} from "@radix-ui/themes";
import { Helmet } from "react-helmet-async";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  useMatch,
  useRouteLoaderData,
  Outlet,
  Link,
  useNavigation,
} from "react-router-dom";
import { FaEdit } from "react-icons/fa";

export function Component() {
  const {
    depts: { data },
  } = useRouteLoaderData("departments-employees") as {
    depts: {
      data: {
        departments: DepartmentsData;
        getDeptNames: string[];
        deptCount: { [key: string]: number };
      };
    };
  };
  const { user } = useAuthProvider() as { user: Userinfo };
  const match = useMatch("/departments");
  const navigation = useNavigation();
  const roles = ["admin", "super-admin"];

  // useEffect(() => {
  //   if (location.pathname === "/departments") {
  //     const sortedKeys = Object.keys(data?.deptCount).sort();
  //     navigate(`/departments/${sortedKeys[0]}`);
  //   }
  // }, [data?.deptCount, location.pathname, navigate]);

  return (
    <>
      <Helmet>
        <title>Departments</title>
        <meta name="description" content="See companys departments" />
      </Helmet>
      <Page>
        {match ? (
          <>
            <div className="flex justify-between items-center">
              <Headings text="Departments" header={true} />
              {roles.includes(user?.role) && (
                <RouterLink
                  to="/departments/create"
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
            {navigation.state === "loading" ? (
              <DataSpinner />
            ) : (
              <div className="mt-8 pb-[2px]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  {data?.getDeptNames
                    .sort()
                    .map((names: string, index: number) => (
                      <Card
                        key={index}
                        className={`min-w-[100%] lg:min-w-[220px]`}
                        variant="classic"
                        size="2"
                        style={{
                          backgroundColor: getRandomColor(names as string),
                        }}
                      >
                        <div className="flex justify-between">
                          <HiOutlineOfficeBuilding />
                          <Link to={`/departments/edit/${names}`}>
                            <FaEdit />
                          </Link>
                        </div>
                        <Link to={`/departments/${names}`}>
                          <>
                            <Headings
                              text={names}
                              header={true}
                              className="capitalize text-[1rem] md:text-[1.4rem] mb-4"
                            />
                            <Texts
                              text={
                                <span className="flex items-center gap-1">
                                  No of employees ({data?.deptCount[names] || 0}
                                  )
                                </span>
                              }
                              className="text-sky-300 font-semibold"
                            />
                          </>
                        </Link>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Outlet />
        )}
      </Page>
    </>
  );
}

Component.displayName = "Departments";
