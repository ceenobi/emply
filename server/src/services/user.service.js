import User from "../models/user.js";

export const updateProfile = async (employeeId, user) => {
  const updatedFields = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    photo: user.profilePhoto,
    dept: user.dept,
    phone: user.phone,
    jobTitle: user.jobTitle,
    status: user.status,
    bio: user.bio,
    address: {
      homeAddress: user.homeAddress,
      state: user.state,
      country: user.country,
    },
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    jobType: user.jobType,
    maritalStatus: user.maritalStatus,
  };
  Object.keys(updatedFields).forEach(
    (key) =>
      updatedFields[key] === "" || null || (undefined && delete updatedFields[key])
  );
  const updatedUser = await User.findOneAndUpdate(
    { employeeId },
    updatedFields,
    {
      new: true,
    }
  );
  return updatedUser;
};

export const checkEmployeeStatus = async (employees, leaves) => {
  const employeeStatus = await Promise.all(
    employees.map(async (employee) => {
      return employee; // Collects all employee objects into an array
    })
  );
  const checkLeaveStatus = await Promise.all(
    leaves.map(async (leave) => {
      return leave.status; // Collects the status of each leave into an array
    })
  );

  // Check if any leave status is "ended"
  if (checkLeaveStatus.includes("ended")) {
    await Promise.all(
      employeeStatus.map(async (employee, index) => {
        if (
          employee.status === "leave" &&
          checkLeaveStatus[index] === "ended"
        ) {
          employee.status = "active"; 
          await employee.save();
        }
      })
    );
  }

  return employeeStatus; 
};
