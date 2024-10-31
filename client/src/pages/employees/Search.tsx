import { Headings, Texts, Paginate } from "@/components";
import { Userinfo } from "@/types/user";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import {
  Await,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { DataSpinner } from "@/components/Spinner";
import TableData from "./components/TableData";

export function Component() {
  const { data } = useLoaderData() as { data: Userinfo };
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") as string) || "";

  return (
    <>
      <Helmet>
        <title>Search results for &quot;{query}&quot;</title>
        <meta name="description" content="View employee search query" />
      </Helmet>
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
                {resolvedData.data.employees.length > 0 ? (
                  <>
                    <div className="mt-4 w-full overflow-x-auto overflow-y-hidden md:overflow-hidden">
                      <TableData employees={resolvedData.data.employees} />
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

Component.displayName = "SearchEmployees";
