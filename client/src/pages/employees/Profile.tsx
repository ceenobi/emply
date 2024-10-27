import { DataSpinner, Headings, Texts } from "@/components";
import { Userinfo } from "@/types/user";
import { Avatar, Badge, Card, Tooltip } from "@radix-ui/themes";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { FaPen, FaPhone } from "react-icons/fa6";
import { Await, useLoaderData, useParams} from "react-router-dom";

type dataType = {
  data: {
    user: Userinfo;
    // events: EventData[];
  };
};
export function Component() {
  const { firstName } = useParams();
  const { data } = useLoaderData() as dataType;

  return (
    <>
      <Helmet>
        <title>{firstName + "'s"} profile</title>
        <meta name="description" content="Profile view" />
      </Helmet>
      <div className="mt-6">
        <Suspense fallback={<DataSpinner />}>
          <Await
            resolve={data}
            errorElement={
              <Texts className="mt-8 px-2" text="Error loading data" />
            }
          >
            {(resolvedData) => {
              const { user } = resolvedData.data;
              const fullName = user.firstName.concat(" ", user.lastName);
              return (
                <>
                  <div className="my-8 md:flex w-full justify-between gap-8">
                    <Card
                      variant="surface"
                      className="bg-sky-100 p-6 rounded-xl text-center w-full md:w-[40%] mb-8"
                    >
                      <div className="mb-4 text-center">
                        <Avatar
                          alt={fullName}
                          fallback={user.firstName.slice(0, 1)}
                          variant="soft"
                          size="8"
                          src={user.photo}
                          color="ruby"
                        />
                      </div>
                      <Texts
                        text={fullName}
                        className="text-center text-xl font-bold text-sky-300"
                      />
                      <Texts
                        text={user.jobTitle}
                        className="mb-2 text-center font-semibold text-gray-700"
                      />
                      <Texts
                        text={<>{user.dept} department</>}
                        className="mb-2 text-center font-semibold text-gray-700 capitalize"
                      />
                      <div className="text-center">
                        <Badge
                          variant="soft"
                          radius="full"
                          size="3"
                          style={{
                            backgroundColor: "var(--sky-300)",
                            color: "var(--cream-200)",
                          }}
                        >
                          ID: {user.employeeId}
                        </Badge>
                      </div>
                      <Texts
                        text={
                          <div className="flex gap-2 justify-center items-center">
                            <FaPhone />
                            <span>{user.phone}</span>
                          </div>
                        }
                        className="mt-3 text-center font-semibold text-gray-700"
                      />
                      <div className="mt-6">
                        <Tooltip content={user.email}>
                          <span className="flex items-center mx-auto gap-1 border border-sky-200 text-sky-300 p-3 rounded-full w-[fit-content] hover:bg-red-400 hover:border-0">
                            <a
                              href={`mailto:${user.email}`}
                              className="text-sm font-semibold"
                            >
                              Send a message
                            </a>
                            <FaPen className="text-tiny" />
                          </span>
                        </Tooltip>
                      </div>
                    </Card>
                    <Card
                      variant="surface"
                      className="p-6 rounded-xl md:w-[58%] mb-8 text-sky-300"
                    >
                      <div>
                        <Headings
                          text="Bio"
                          header={false}
                          className="text-lg mb-4"
                        />
                        <Texts text={user.bio || "No bio added yet."} />
                      </div>
                      <div className="my-6">
                        <Headings
                          text="Address"
                          header={false}
                          className="text-lg mb-4"
                        />
                        <Texts
                          text={
                            user.address?.homeAddress || "No address added yet."
                          }
                        />
                        <Texts
                          text={user.address?.state || "No state added yet."}
                        />
                        <Texts
                          text={
                            user.address?.country || "No country added yet."
                          }
                        />
                      </div>
                    </Card>
                  </div>
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

Component.displayName = "Profile";
