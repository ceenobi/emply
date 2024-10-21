import { LazySpinner } from "@/components/Spinner";
import {
  forgotPasswordAction,
  loginAction,
  resetPasswordAction,
} from "@/pages/auth/action";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  defer,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { PrivateRoutes, PublicRoutes, AdminRoutes } from "./ProtectedRoutes";
import * as employeeData from "@/pages/employees/queries";
import * as leaveData from "@/pages/leaves/queries";
import * as eventData from "@/pages/events/queries";
import * as payrollData from "@/pages/payroll/queries";
import * as settingsData from "@/pages/settings/queries";
import * as employeeAction from "@/pages/employees/actions";
import * as leaveAction from "@/pages/leaves/actions";
import * as eventAction from "@/pages/events/actions";
import * as settingsAction from "@/pages/settings/actions";
import * as payrollAction from "@/pages/payroll/actions";
import { useAuthProvider } from "@/store";
import { Userinfo } from "@/types/user";

const AuthLayout = lazy(() => import("@/components/layouts/auth"));
const RootLayout = lazy(() => import("@/components/layouts/root"));
const RegisterEmployee = lazy(() => import("@/pages/employees/Register"));
const AllLeavesPage = lazy(() => import("@/pages/leaves/AllLeaves"));
const VerifyAccount = lazy(() => import("@/pages/auth/VerifyAccount"));
const Payroll = lazy(() => import("@/pages/payroll"));

export default function AppRoutes() {
  const { user } = useAuthProvider() as {
    user: Userinfo;
  };

  const routes = [
    {
      path: "/",
      id: "departments",
      element: (
        <PrivateRoutes>
          <Suspense fallback={<LazySpinner />}>
            <RootLayout />
          </Suspense>
        </PrivateRoutes>
      ),
      loader: employeeData.getDepartments,
      children: [
        {
          path: "employees",
          id: "employees",
          lazy: () => import("@/pages/employees"),
          loader: async ({ request }) => {
            const searchParams = new URL(request.url).searchParams;
            const page = searchParams.get("page") || 1;
            const data = employeeData.getAllEmployees(page);
            return defer({ data });
          },
          action: employeeAction.deleteEmployeeAction,
          children: [
            {
              path: "register",
              element: (
                <AdminRoutes>
                  <RegisterEmployee />
                </AdminRoutes>
              ),
              action: employeeAction.registerAction,
            },
            {
              path: ":firstName/:employeeId",
              lazy: () => import("@/pages/employees/Profile"),
              loader: ({ params }) => {
                const data = employeeData.getAnEmployee(
                  params.firstName as string,
                  params.employeeId as string
                );
                return defer({ data });
              },
            },
            {
              path: "search",
              lazy: () => import("@/pages/employees/Search"),
              loader: async ({ request }) => {
                const searchParams = new URL(request.url).searchParams;
                const searchTerm = searchParams.get("query") as string;
                const page = searchParams.get("page") || 1;
                const data = employeeData.searchEmployees(searchTerm, page);
                return defer({ data });
              },
            },
          ],
        },
        {
          path: "leaves",
          lazy: () => import("@/pages/leaves"),
          loader: async () => {
            const data = leaveData.getEmployeeLeaves();
            return defer({ data });
          },
          action: leaveAction.handleUpdateOrDeleteLeaveAction,
          children: [
            {
              path: "apply",
              lazy: () => import("@/pages/leaves/Apply"),
              action: leaveAction.applyLeaveAction,
            },
            {
              path: "all",
              element: (
                <AdminRoutes>
                  <AllLeavesPage />
                </AdminRoutes>
              ),
              loader: async ({ request }) => {
                const searchParams = new URL(request.url).searchParams;
                const page = searchParams.get("page") || 1;
                const data = leaveData.getAllLeaves(page);
                return defer({ data });
              },
              action: leaveAction.approveLeaveAction,
            },
            {
              path: "search",
              lazy: () => import("@/pages/leaves/Search"),
              loader: async ({ request }) => {
                const searchParams = new URL(request.url).searchParams;
                const searchTerm = searchParams.get("query") as string;
                const page = searchParams.get("page") || 1;
                const data = leaveData.searchLeaves(searchTerm, page);
                return defer({ data });
              },
            },
          ],
        },
        {
          path: "events",
          lazy: () => import("@/pages/events"),
          loader: async ({ request }) => {
            const searchParams = new URL(request.url).searchParams;
            const page = searchParams.get("page") || 1;
            const data = eventData.getEvents(page);
            return defer({ data });
          },
          action: eventAction.handleUpdateOrDeleteEventAction,
          children: [
            {
              path: "create",
              lazy: () => import("@/pages/events/Create"),
              action: eventAction.createEventAction,
            },
            {
              path: "search",
              lazy: () => import("@/pages/events/Search"),
              loader: async ({ request }) => {
                const searchParams = new URL(request.url).searchParams;
                const searchTerm = searchParams.get("query") as string;
                const page = searchParams.get("page") || 1;
                const data = eventData.searchEvents(searchTerm, page);
                return defer({ data });
              },
            },
          ],
        },
        {
          path: "settings",
          lazy: () => import("@/pages/settings"),
          loader: async () => {
            const data = settingsData.trackPayrollStatus(
              user?.firstName,
              user?.employeeId as string
            );
            const userActivities = await employeeData.getAnEmployee(
              user?.firstName as string,
              user?.employeeId as string
            );
            return defer({ data, userActivities });
          },
          children: [
            {
              path: "change-password",
              lazy: () => import("@/pages/settings/ChangePassword"),
              action: settingsAction.changePasswordAction,
            },
            {
              path: "delete-account",
              lazy: () => import("@/pages/settings/DeleteAccount"),
            },
            {
              path: "profile/:firstName/:employeeId",
              lazy: () => import("@/pages/settings/Profile"),
              action: settingsAction.updateProfileAction,
              loader: ({ params }) => {
                const data = employeeData.getAnEmployee(
                  params.firstName as string,
                  params.employeeId as string
                );
                return data;
              },
            },
            {
              path: "payroll-history",
              lazy: () => import("@/pages/settings/Payroll"),
              loader: async ({ request }) => {
                const searchParams = new URL(request.url).searchParams;
                const page = searchParams.get("page") || 1;
                const data = settingsData.getEmployeePayrollHistory(
                  user?.firstName,
                  user?.employeeId as string,
                  page
                );
                return defer({ data });
              },
            },
          ],
        },
        {
          path: "payroll",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <AdminRoutes>
                <Payroll />
              </AdminRoutes>
            </Suspense>
          ),
          loader: async ({ request }) => {
            const searchParams = new URL(request.url).searchParams;
            const page = searchParams.get("page") || 1;
            const data = payrollData.getAllPayroll(page);
            return defer({ data });
          },
          action: payrollAction.togglePayrollStatusAction,
          children: [
            {
              path: "create",
              id: "payrollEmployees",
              lazy: () => import("@/pages/payroll/Create"),
              loader: async ({ request }) => {
                const searchParams = new URL(request.url).searchParams;
                const page = searchParams.get("page") || 1;
                const data = await employeeData.getAllEmployees(page);
                return data;
              },
              action: payrollAction.createPayrollAction,
            },
            {
              path: ":firstName/:employeeId/:payrollDate",
              lazy: () => import("@/pages/payroll/EditPayroll"),
              loader: ({ params }) => {
                const data = payrollData.getAPayroll(
                  params.firstName as string,
                  params.employeeId as string,
                  params.payrollDate as string
                );
                return data;
              },
              action: payrollAction.updatePayrollAction,
            },
            {
              path: "search",
              lazy: () => import("@/pages/payroll/Search"),
              loader: async ({ request }) => {
                const searchParams = new URL(request.url).searchParams;
                const searchTerm = searchParams.get("query") as string;
                const page = searchParams.get("page") || 1;
                const data = payrollData.searchPayroll(searchTerm, page);
                return defer({ data });
              },
            },
          ],
        },
      ],
    },
    {
      element: (
        <PublicRoutes>
          <Suspense fallback={<LazySpinner />}>
            <AuthLayout />
          </Suspense>
        </PublicRoutes>
      ),
      children: [
        {
          path: "login",
          lazy: () => import("@/pages/auth/Login"),
          action: loginAction,
        },
        {
          path: "forgot-password",
          lazy: () => import("@/pages/auth/ForgotPassword"),
          action: forgotPasswordAction,
        },
        {
          path: "reset-password/:token",
          lazy: () => import("@/pages/auth/ResetPassword"),
          action: resetPasswordAction,
        },
      ],
    },
    {
      path: "verify-account",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <VerifyAccount />B
        </Suspense>
      ),
    },
  ] as RouteObject[];

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}