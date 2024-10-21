import dayjs from "dayjs";
import Leave from "../models/leave.js";
import User from "../models/user.js";

export const leaveRequest = async (user, leaveBody) => {
  if (!user || typeof user !== "string") {
    throw new Error("Invalid user input");
  }
  if (!leaveBody || typeof leaveBody !== "object") {
    throw new Error("Invalid leaveBody input");
  }
  const { leavePhoto, description, startDate, endDate, leaveType } = leaveBody;
  const getUser = await User.findById(user);
  const newLeave = await Leave.create({
    userId: getUser.id,
    employeeId: getUser.employeeId,
    photo: leavePhoto,
    description,
    startDate,
    endDate,
    leaveType,
  });
  const leave = await newLeave.save();
  return leave;
};

export const updateLeaveDetails = async (eventId, eventBody) => {
  const { leavePhoto, description, startDate, endDate, leaveType } = eventBody;
  const updatedFields = {
    photo: leavePhoto,
    description,
    startDate,
    endDate,
    leaveType,
  };
  Object.keys(updatedFields).forEach(
    (key) =>
      updatedFields[key] === "" || (undefined && delete updatedFields[key])
  );
  const updatedLeave = await Leave.findByIdAndUpdate(eventId, updatedFields, {
    new: true,
  });
  return updatedLeave;
};

const leaveType = ["vacation", "maternity", "paternity", "annual leave"];
export const approveLeaveRequest = async (findLeave, status) => {
  let startDateObj = dayjs(findLeave.startDate);
  let endDateObj = dayjs(findLeave.endDate);
  let differenceInDays = endDateObj.diff(startDateObj, "day") + 1;
  findLeave.status = status;
  if (status === "approved") {
    const getUser = await User.findById(findLeave.userId);
    getUser.leaveCount -= differenceInDays;
    findLeave.isApproved = true;
    if (findLeave.leaveType === "sick") {
      getUser.status = "sick";
    } else if (leaveType.includes(findLeave.leaveType)) {
      getUser.status = "leave";
    }
    await getUser.save();
  }

  const updateLeaveStatus = await findLeave.save();
  return updateLeaveStatus;
};

export const checkLeaveStatus = async (leaves) => {
  const updatedLeaves = await Promise.all(
    leaves.map(async (leave) => {
      let startDateObj = dayjs(leave.startDate);
      let endDateObj = dayjs(leave.endDate);
      let currentDate = dayjs();
      if (
        startDateObj.isBefore(currentDate, "minute") &&
        endDateObj.isBefore(currentDate, "minute")
      ) {
        leave.status = "active";
      }
      await leave.save();
      return leave;
    })
  );
  return updatedLeaves;
};
