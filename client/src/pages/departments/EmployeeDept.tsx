import { DataSpinner, Headings, Paginate, Texts } from "@/components";
import { Userinfo } from "@/types/user";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import {
  Await,
  useLoaderData,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import TableData from "../employees/components/TableData";
import { DepartmentsData } from "@/types/dept";

export function Component() {
  const { departmentName } = useParams();
  const { data: department } = useLoaderData() as {
    data: Userinfo;
  };
  const {
    depts: { data },
  } = useRouteLoaderData("departments-employees") as {
    depts: {
      data: {
        departments: DepartmentsData[];
        getDeptNames: string[];
        deptCount: { [key: string]: number };
      };
    };
  };
  const getCurrentDepartment = data.departments?.filter(
    (dept) => dept.name === departmentName
  );

  return (
    <>
      <Helmet>
        <title>
          Department | {departmentName}. View employees in a department
        </title>
        <meta name="description" content="View all employees in a dept" />
      </Helmet>
      <div className="mt-6">
        <Headings
          text={departmentName}
          header={true}
          className="capitalize my-8"
        />
        <Texts
          text={
            <>
              <span className="font-semibold">Supervisor: </span>{" "}
              {getCurrentDepartment[0]?.supervisor}
            </>
          }
        />
        {/* {deptHeaders?.getDeptNames
          .sort()
          .map((names: string, index: number) => (
            <Link
              to={`/departments/${names}`}
              key={index}
              className={`capitalize mr-6 ${names === deptName ? "font-semibold text-sky-300 border-b-2 pb-1 border-sky-300" : ""}`}
            >
              {names} ({deptHeaders?.deptCount[names] || 0})
            </Link>
          ))} */}
        <Suspense fallback={<DataSpinner />}>
          <Await
            resolve={department}
            errorElement={
              <Texts className="mt-8" text={"Error fetching data"} />
            }
          >
            {(resolvedData) => (
              <>
                {resolvedData.data.department.length > 0 ? (
                  <>
                    <div className="mt-4 w-full overflow-x-auto overflow-y-hidden md:overflow-hidden">
                      <TableData employees={resolvedData.data.department} />
                      <Paginate
                        totalPages={resolvedData.data.totalPages}
                        count={resolvedData.data.count}
                      />
                    </div>
                  </>
                ) : (
                  <Texts
                    className="mt-8"
                    text="There are no employees currently in this department."
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

Component.displayName = "EmployeeDept";
