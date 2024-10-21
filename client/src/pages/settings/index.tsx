import { DataSpinner, Headings, Page, RouterLink, Texts } from "@/components";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";
import { formatDate, formatEditDate, payrollStatusColorMap } from "@/utils";
import { Badge, Card, Spinner } from "@radix-ui/themes";
import { Helmet } from "react-helmet-async";
import { FaBell, FaEdit, FaLock, FaRegCalendarAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { MdOutlineViewTimeline, MdVerified } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import {
  Await,
  Outlet,
  useLoaderData,
  useMatch,
  useNavigation,
} from "react-router-dom";
import { GiNetworkBars } from "react-icons/gi";
import { PiAirplaneTiltFill } from "react-icons/pi";
// import { GiTakeMyMoney } from "react-icons/gi";
import { PayrollProps } from "@/types/payroll";
import { Suspense } from "react";

export function Component() {
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };
  const data = useLoaderData();
  const { data: payrollData, userActivities } = data as {
    data: { payrollData: PayrollProps };
    userActivities: { data: { events: []; leaves: [] } };
  };
  const {
    email,
    firstName,
    lastName,
    dept,
    phone,
    isVerified,
    createdAt,
    status,
    employeeId,
  } = user;
  const match = useMatch("/settings");
  const navigation = useNavigation();

  return (
    <>
      <Helmet>
        <title>Settings - Change some stuff, see overview.</title>
        <meta name="description" content="Edit your preference" />
      </Helmet>
      <Page>
        {match ? (
          <>
            {navigation.state === "loading" ? (
              <DataSpinner />
            ) : (
              <div className="md:grid grid-cols-12 gap-4 justify-between">
                <div className="col-span-7">
                  <div className="md:flex justify-between">
                    <div className="bg-sky-300 shadow-lg md:w-[70%] mb-6 rounded-xl p-3">
                      <div>
                        <div>
                          <div className="flex justify-between text-sky-100">
                            <Texts
                              className="text-sm font-semibold"
                              text="Your profile"
                            />
                            <IoPersonCircle className="text-2xl text-light-100" />
                          </div>
                        </div>
                        <Headings
                          text={firstName.concat(" ", lastName)}
                          header={true}
                          className="text-sky-100"
                        />
                        <div className="mt-4">
                          <Texts
                            className="text-sky-100 font-bold"
                            text={`Email: ${email}`}
                          />
                          <Texts
                            className="text-sky-100 font-bold capitalize"
                            text={`Department: ${dept}`}
                          />
                          <Texts
                            className="text-sky-100 font-bold capitalize"
                            text={`Mobile: ${phone}`}
                          />
                          <Texts
                            className="text-sky-100 font-bold capitalize"
                            text={`Registered: ${formatDate(createdAt as string)}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:w-[28%] mb-6">
                      <div className="flex flex-col gap-4">
                        <Card
                          className="bg-sky-100 shadow-lg border-sky-200"
                          variant="surface"
                        >
                          <div className="text-center font-semibold flex flex-col items-center text-sky-300 p-1">
                            {status === "active" || status === "sick" ? (
                              <GiNetworkBars
                                className={`text-4xl ${status === "active" ? "text-green-400" : status === "sick" ? "text-red-400" : ""}`}
                              />
                            ) : (
                              <PiAirplaneTiltFill
                                className={`text-4xl ${status === "leave" ? "text-blue-400" : "text-sky-300"}`}
                              />
                            )}
                            <Texts text={status} className="capitalize" />
                          </div>
                        </Card>
                        <Card
                          className="bg-sky-100 shadow-lg border-sky-200"
                          variant="surface"
                        >
                          <div className="text-center font-semibold flex flex-col items-center text-sky-300 p-1">
                            <MdVerified className="text-4xl" />
                            <Texts
                              text={
                                isVerified ? "Verified " : "Email not verified "
                              }
                            />
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                  <Card
                    variant="surface"
                    className=" bg-sky-100 p-3 rounded-lg shadow-lg mb-6"
                  >
                    <Headings
                      className="font-bold text-2xl my-3 text-sky-300"
                      text="My summary"
                      header={false}
                    />

                    <RouterLink
                      to="/events"
                      className="w-full"
                      text={
                        <div className="flex items-center font-semibold text-sky-300 w-full p-2 hover:bg-sky-200 hover:transition duration-150 ease-out hover:rounded-md mb-4">
                          <div className="flex gap-2 items-center flex-grow">
                            <MdOutlineViewTimeline className="text-2xl" />
                            <span>
                              Events &nbsp; (
                              {userActivities?.data?.events.length})
                            </span>
                          </div>
                          <IoIosArrowForward size="24px" />
                        </div>
                      }
                    />
                    <RouterLink
                      to="/leaves"
                      className="w-full"
                      text={
                        <div className="flex items-center font-semibold text-sky-300 w-full p-2 hover:bg-sky-200 hover:transition duration-150 ease-out hover:rounded-md mb-4">
                          <div className="flex gap-2 items-center flex-grow">
                            <FaRegCalendarAlt className="text-2xl" />
                            <span>
                              Leaves &nbsp; (
                              {userActivities?.data?.leaves.length})
                            </span>
                          </div>
                          <IoIosArrowForward size="24px" />
                        </div>
                      }
                    />
                  </Card>
                  <Card
                    variant="surface"
                    className=" bg-sky-100 p-3 rounded-lg shadow-lg mb-6"
                  >
                    <Headings
                      className="font-bold text-2xl my-3 text-sky-300"
                      text="Security and privacy"
                      header={false}
                    />
                    <RouterLink
                      to="/settings/change-password"
                      className="mb-4"
                      text={
                        <div className="flex items-center font-semibold text-sky-300 w-full p-2 hover:bg-sky-200 hover:transition duration-150 ease-out hover:rounded-md mb-4">
                          <div className="flex gap-2 items-center flex-grow">
                            <FaLock className="text-2xl" />
                            <span>Change password</span>
                          </div>
                          <IoIosArrowForward size="24px" />
                        </div>
                      }
                    />
                    <RouterLink
                      to="/settings/delete-account"
                      className="mb-4"
                      text={
                        <div className="flex items-center font-semibold text-sky-300 w-full p-2 hover:bg-sky-200 hover:transition duration-150 ease-out hover:rounded-md mb-4">
                          <div className="flex gap-2 items-center flex-grow">
                            <RiDeleteBin7Fill className="text-2xl" />
                            <span>Delete account</span>
                          </div>
                          <IoIosArrowForward size="24px" />
                        </div>
                      }
                    />
                  </Card>
                </div>
                <div className="col-span-5">
                  <Card
                    className="bg-sky-100 shadow-lg hover:bg-sky-200 hover:transition duration-150 ease-out border-sky-200 mb-4"
                    variant="surface"
                  >
                    <RouterLink
                      to={`/settings/profile/${firstName?.toLowerCase()}/${employeeId}`}
                      className="flex flex-col items-center p-1"
                      text={
                        <div className="text-sky-300 flex flex-col items-center font-semibold text-center">
                          <FaEdit className="text-4xl" />
                          Edit profile
                        </div>
                      }
                    />
                  </Card>
                  <div className="bg-sky-300 shadow-lg mb-5 rounded-xl p-3">
                    <Suspense
                      fallback={
                        <div className="flex justify-center">
                          <Spinner className="text-sky-100" />
                        </div>
                      }
                    >
                      <Await
                        resolve={payrollData}
                        errorElement={
                          <Texts
                            className="mt-8 text-sky-100"
                            text="Error loading data"
                          />
                        }
                      >
                        {(resolvedData) => (
                          <>
                            {resolvedData.data.length > 0 ? (
                              <>
                                {resolvedData.data.map((item: PayrollProps) => (
                                  <>
                                    <div className="flex justify-between items-center text-sky-100 mb-2">
                                      <Texts
                                        className="font-semibold"
                                        text="Payroll update"
                                      />
                                      <FaBell className="text-2xl text-light-100" />
                                    </div>
                                    <div className="flex justify-between items-center text-sky-100 mb-2">
                                      <Texts
                                        className="font-semibold"
                                        text="Payment status:"
                                      />
                                      <Badge
                                        size="3"
                                        variant="solid"
                                        color={
                                          payrollStatusColorMap[
                                            item.status as keyof typeof payrollStatusColorMap
                                          ]
                                        }
                                      >
                                        {item.status}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-sky-100">
                                      {" "}
                                      <Texts
                                        className="font-semibold"
                                        text="Last payroll created:"
                                      />
                                      <Texts
                                        text={
                                          item.payrollDate
                                            ? formatEditDate(
                                                item.payrollDate as string
                                              )
                                            : "Unavailable"
                                        }
                                      />
                                    </div>

                                    <div className="flex justify-between items-center text-sky-100">
                                      <Texts
                                        className="font-semibold"
                                        text="Last payment date:"
                                      />
                                      <Texts
                                        text={
                                          item.paymentDate
                                            ? formatEditDate(
                                                item.paymentDate as string
                                              )
                                            : "Unavailable"
                                        }
                                      />
                                    </div>
                                    <div className="text-end">
                                      <RouterLink
                                        to="/settings/payroll-history"
                                        text="See more"
                                        className="text-cream-100 font-semibold"
                                      />
                                    </div>
                                  </>
                                ))}
                              </>
                            ) : (
                              <div className="h-[115px]">
                                <div className="flex justify-between items-center text-sky-100 mb-2">
                                  <Texts
                                    className="font-semibold"
                                    text="Payroll update"
                                  />
                                  <FaBell className="text-2xl text-light-100" />
                                </div>
                                <Texts
                                  className="mt-8 text-sky-100"
                                  text="Nothing to show yet"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </Await>
                    </Suspense>
                  </div>
                  {/* <Card
                    className="bg-sky-100 shadow-lg md:w-[100%] mb-4 hover:bg-sky-200 hover:transition duration-150 ease-out border-sky-200 "
                    variant="surface"
                  >
                    <RouterLink
                      to="/settings/payroll-history"
                      className="flex flex-col items-center p-1"
                      text={
                        <div className="text-sky-300 flex flex-col items-center font-semibold text-center">
                          <GiTakeMyMoney className="text-4xl" />
                          Payroll
                        </div>
                      }
                    />
                  </Card> */}
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

Component.displayName = "Settings";
