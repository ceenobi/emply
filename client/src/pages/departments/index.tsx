import { Headings, Page, RouterLink } from "@/components";
import { Helmet } from "react-helmet-async";
import { AiOutlinePlusCircle } from "react-icons/ai";


export function Component() {
  return (
    <>
      <Helmet>
        <title>Departments</title>
        <meta name="description" content="See companys departments" />
      </Helmet>
      <Page>
        <div className="flex justify-between items-center">
          <Headings text="Departments" header={true} />
          <RouterLink
            to="/payroll/create"
            className="text-md font-semibold text-sky-100 bg-sky-300 p-2 rounded-lg"
            text={
              <div className="flex justify-center items-center gap-2 w-[150px] ">
                <AiOutlinePlusCircle />
                Create
              </div>
            }
          />
        </div>
      </Page>
    </>
  );
}

Component.displayName = "Departments"