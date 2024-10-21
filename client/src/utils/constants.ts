import { RiHome4Line } from "react-icons/ri";
import { GoProjectRoadmap } from "react-icons/go";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  MdOutlineViewTimeline,
  MdOutlineDateRange,
  MdOutlineTitle,
  MdOutlineLocationOn,
} from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { FiMail } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { RxPerson } from "react-icons/rx";
import { CiPhone, CiMoneyCheck1 } from "react-icons/ci";
import {
  validateConfirmPassword,
  validateEmail,
  validateField,
  validateFirstName,
  validateLastName,
  validatePassword,
  validatePhone,
} from "./validators";
import { BadgeProps } from "@radix-ui/themes";
import { IoMdTime } from "react-icons/io";
import { PiAddressBookTabs } from "react-icons/pi";
import { FaRegFlag } from "react-icons/fa";
import { LiaLandmarkSolid } from "react-icons/lia";

export const sidebarLinks = [
  {
    id: 1,
    Icon: RiHome4Line,
    name: "Dashboard",
    path: "/",
  },
  {
    id: 2,
    Icon: GoProjectRoadmap,
    name: "Tasks",
    path: "/tasks",
  },
  {
    id: 3,
    Icon: HiOutlineOfficeBuilding,
    name: "Departments",
    path: "/departments",
  },
  {
    id: 4,
    Icon: FaPeopleGroup,
    name: "Employees",
    path: "/employees",
  },
  {
    id: 5,
    Icon: MdOutlineViewTimeline,
    name: "Events",
    path: "/events",
  },
  {
    id: 6,
    Icon: FaRegCalendarAlt,
    name: "Leaves",
    path: "/leaves",
  },
  {
    id: 7,
    Icon: GiTakeMyMoney,
    name: "Payroll",
    path: "/payroll",
  },
  {
    id: 8,
    Icon: IoSettingsOutline,
    name: "Settings",
    path: "/settings",
  },
];

export const inputFields = [
  {
    label: "Email",
    type: "email",
    id: "email",
    name: "email",
    placeholder: "johndoe@email.com",
    Icon: FiMail,
    validate: (value: string) => validateEmail(value),
    isRequired: true,
  },
  {
    label: "First Name",
    type: "text",
    id: "firstName",
    name: "firstName",
    placeholder: "john",
    Icon: RxPerson,
    validate: (value: string) => validateFirstName(value),
    isRequired: true,
  },
  {
    label: "Last Name",
    type: "text",
    id: "lastName",
    name: "lastName",
    placeholder: "doe",
    Icon: RxPerson,
    validate: (value: string) => validateLastName(value),
    isRequired: true,
  },
  {
    label: "Password",
    type: "password",
    id: "password",
    name: "password",
    placeholder: "password",
    Icon: RiLockPasswordLine,
    validate: (value: string) => validatePassword(value),
    isRequired: true,
  },
  {
    label: "Confirm Password",
    type: "password",
    id: "confirmPassword",
    name: "confirmPassword",
    placeholder: "confirm password",
    Icon: RiLockPasswordLine,
    validate: (value: string) => validateConfirmPassword(value),
    isRequired: true,
  },
  {
    label: "Phone Number",
    type: "tel",
    id: "phone",
    name: "phone",
    placeholder: "00000000",
    Icon: CiPhone,
    validate: (value: string) => validatePhone(value),
    isRequired: true,
  },
  {
    label: "Start Date",
    type: "date",
    id: "startDate",
    name: "startDate",
    placeholder: "24/24/24",
    Icon: MdOutlineDateRange,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "End Date",
    type: "date",
    id: "endDate",
    name: "endDate",
    placeholder: "24/24/24",
    Icon: MdOutlineDateRange,
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Date of Birth",
    type: "date",
    id: "dateOfBirth",
    name: "dateOfBirth",
    placeholder: "24/24/24",
    Icon: MdOutlineDateRange,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Title",
    type: "text",
    id: "title",
    name: "title",
    placeholder: "title",
    Icon: MdOutlineTitle,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Time",
    type: "time",
    id: "time",
    name: "time",
    placeholder: "Time for event",
    Icon: IoMdTime,
    validate: (value: string) =>
      validateField(value, "Set a time for your event"),
    isRequired: true,
  },
  {
    label: "Location",
    type: "text",
    id: "location",
    name: "location",
    placeholder: "locaton",
    Icon: MdOutlineLocationOn,
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Current Password",
    type: "password",
    id: "currentPassword",
    name: "currentPassword",
    placeholder: "current password",
    Icon: RiLockPasswordLine,
    validate: (value: string) => validatePassword(value),
    isRequired: true,
  },
  {
    label: "New Password",
    type: "password",
    id: "newPassword",
    name: "newPassword",
    placeholder: "new password",
    Icon: RiLockPasswordLine,
    validate: (value: string) => validateConfirmPassword(value),
    isRequired: true,
  },
  {
    label: "Address",
    type: "text",
    id: "homeAddress",
    name: "homeAddress",
    placeholder: "address",
    Icon: PiAddressBookTabs,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "State",
    type: "text",
    id: "state",
    name: "state",
    placeholder: "current state",
    Icon: LiaLandmarkSolid,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Country",
    type: "text",
    id: "country",
    name: "country",
    placeholder: "country",
    Icon: FaRegFlag,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Employee Id",
    type: "text",
    id: "employeeId",
    name: "employeeId",
    placeholder: "employeeId",
    Icon: RxPerson,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Salary",
    type: "number",
    id: "salary",
    name: "salary",
    placeholder: "0",
    Icon: GiTakeMyMoney,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Allowance",
    type: "number",
    id: "allowance",
    name: "allowance",
    placeholder: "0",
    Icon: GiTakeMyMoney,
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Tax - value as percentage",
    type: "number",
    id: "tax",
    name: "tax",
    placeholder: "0%",
    Icon: CiMoneyCheck1,
    validate: (value: string) => validateField(value, "Set tax rate"),
    isRequired: true,
  },
  {
    label: "Deductions",
    type: "number",
    id: "deductions",
    name: "deductions",
    placeholder: "0",
    Icon: GiTakeMyMoney,
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Late Days",
    type: "number",
    id: "lateDays",
    name: "lateDays",
    placeholder: "0",
    Icon: GiTakeMyMoney,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Lwp",
    type: "number",
    id: "lwp",
    name: "lwp",
    placeholder: "0",
    Icon: GiTakeMyMoney,
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Payroll Date",
    type: "date",
    id: "payrollDate",
    name: "payrollDate",
    placeholder: "24/24/24",
    Icon: MdOutlineDateRange,
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
];

export const gender = [
  {
    _id: "1",
    name: "male",
  },
  {
    _id: "2",
    name: "female",
  },
  {
    _id: "3",
    name: "other",
  },
];

export const jobType = [
  {
    _id: "1",
    name: "full-time",
  },
  {
    _id: "2",
    name: "part-time",
  },
  {
    _id: "3",
    name: "contract",
  },
  {
    _id: "4",
    name: "hybrid",
  },
  {
    _id: "5",
    name: "remote",
  },
];

export const employeeRole = [
  { _id: "1", name: "user" },
  {
    _id: "2",
    name: "admin",
  },
  {
    _id: "3",
    name: "super-admin",
  },
];

export const employeeLeaveType = [
  { _id: "1", name: "vacation" },
  { _id: "2", name: "sick" },
  {
    _id: "3",
    name: "maternity",
  },
  {
    _id: "4",
    name: "paternity",
  },
  {
    _id: "5",
    name: "annual leave",
  },
];

export const getRandomColor = (text: string) => {
  const colors = [
    "#ff9c6e",
    "#ff7875",
    "#ffc069",
    "#ffd666",
    "#fadb14",
    "#95de64",
    "#5cdbd3",
    "#69c0ff",
    "#85a5ff",
    "#b37feb",
    "#ff85c0",
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;

  return colors[hash];
};

export const approveLeaveOptions = [
  { _id: "1", name: "approved" },
  { _id: "2", name: "rejected" },
];

export const leaveStatusColorMap: Record<string, BadgeProps["color"]> = {
  all: "blue",
  approved: "jade",
  rejected: "crimson",
  pending: "cyan",
};

export const employeeStatusColorMap: Record<string, BadgeProps["color"]> = {
  active: "jade",
  sick: "crimson",
  other: "gray",
  leave: "indigo",
};

export const payrollStatusColorMap: Record<string, BadgeProps["color"]> = {
  all: "blue",
  paid: "jade",
  pending: "amber",
};

export const eventStatusColorMap: Record<string, BadgeProps["color"]> = {
  all: "blue",
  upcoming: "indigo",
  ongoing: "jade",
  ended: "crimson",
  cancelled: "violet",
  postponed: "amber",
};

export const eventStatus = [
  {
    _id: "4",
    name: "cancelled",
  },
  {
    _id: "5",
    name: "postponed",
  },
];

export const selectJobTitle = [
  { _id: "Web developer", name: "Web developer" },
  { _id: "Customer service", name: "Customer service" },
  { _id: "Student laison", name: "Student laison" },
  { _id: "Facility manager", name: "Facility manager" },
  { _id: "Utility", name: "Utility" },
  { _id: "Social media handler", name: "Social media handler" },
  { _id: "Head of Products", name: "Head of Products" },
  { _id: "HR Manager", name: "HR Manager" },
  { _id: "Data scientist", name: "Data scientist" },
];

export const employeeDept = [
  { _id: "1", name: "human resources" },
  { _id: "2", name: "operations" },
  {
    _id: "3",
    name: "marketing",
  },
  {
    _id: "4",
    name: "products",
  },
];

export const employeeStatus = [
  { _id: "1", name: "active" },
  { _id: "2", name: "leave" },
  {
    _id: "3",
    name: "sick",
  },
  {
    _id: "4",
    name: "other",
  },
];

export const payrollFilters = [
  { _id: "1", name: "payrollDate" },
  { _id: "2", name: "paymentDate" },
];

export const maritalStatus = [
  { _id: "1", name: "single" },
  { _id: "2", name: "married" },
  { _id: "3", name: "divorced" },
  { _id: "4", name: "widowed" },
];
