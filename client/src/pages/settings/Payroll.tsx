import {
  DataSpinner,
  Headings,
  Paginate,
  PayrollCard,
  Texts,
} from "@/components";
import { PayrollProps } from "@/types/payroll";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Await, useLoaderData } from "react-router-dom";
import TableData from "./components/payroll/TableData";

export function Component() {
  const { data } = useLoaderData() as { data: PayrollProps };

  return (
    <>
      <Helmet>
        <title>View your payroll history</title>
        <meta name="description" content="Payroll history for an employee" />
      </Helmet>
      <Headings className="my-8" text="Payroll history" header={true} />
      <div className="mt-6">
        <Suspense fallback={<DataSpinner />}>
          <Await
            resolve={data}
            errorElement={<Texts className="mt-8" text="Error loading data" />}
          >
            {(resolvedData) => (
              <>
                {resolvedData.data.payroll.length > 0 ? (
                  <>
                    <PayrollCard
                      totalNetPay={resolvedData.data.totalNetPay}
                      totalAllowance={resolvedData.data.totalAllowance}
                      totalDeductions={resolvedData.data.totalDeductions}
                    />
                    <div className="mt-8 w-full overflow-x-auto overflow-y-hidden md:overflow-hidden">
                      <TableData payroll={resolvedData.data.payroll} />
                      <Paginate
                        totalPages={resolvedData.data.totalPages}
                        count={resolvedData.data.count}
                      />
                    </div>
                  </>
                ) : (
                  <Texts
                    className="mt-8"
                    text="There are no payment history to display"
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

Component.displayName = "EmployeePayroll";
