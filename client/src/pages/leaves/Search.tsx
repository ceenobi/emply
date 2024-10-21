import { DataSpinner, Headings, Paginate, Texts } from "@/components";
import { LeaveProps } from "@/types/leave";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import TableData from "./components/TableData";

export function Component() {
  const { data } = useLoaderData() as { data: LeaveProps };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") as string) || "";

  return (
    <>
      <Helmet>
        <title>Search results for &quot;{query}&quot;</title>
        <meta name="description" content="View employee search query" />
      </Helmet>

      <IoMdArrowDropleftCircle
        className="text-2xl text-sky-300 cursor-pointer"
        role="button"
        onClick={() => navigate("/leaves")}
      />
      <div className="mt-6 flex justify-between items-center">
        <Headings text={`Search results for: "${query}"`} header={true} />
      </div>
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
                    <div className="mt-4 w-full overflow-x-auto overflow-y-hidden md:overflow-hidden">
                      <TableData leaves={resolvedData.data.leaves} />
                      <Paginate
                        totalPages={resolvedData.data.totalPages}
                        count={resolvedData.data.count}
                      />
                    </div>
                  </>
                ) : (
                  <Texts
                    className="mt-8"
                    text="Search query did not return any results"
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

Component.displayName = "SearchLeaves";
