import Dept from "../models/dept.js";
import createHttpError from "http-errors";
import NodeCache from "node-cache";
import tryCatch from "../utils/tryCatchFn.js";
import User from "../models/user.js";

//const cache = new NodeCache({ stdTTL: 600 });

export const createDepartment = tryCatch(async (req, res, next) => {
  const { name, employeeId } = req.body;
  if (!name || !employeeId) {
    return next(createHttpError(400, "Department or EmployeeId is required"));
  }
  const deptNameExists = await Dept.findOne({ name: name });
  if (deptNameExists) {
    return next(createHttpError(400, "Department name already exists"));
  }
  const findEmployee = await User.findOne({ employeeId });
  if (!findEmployee) {
    return next(createHttpError(400, "Employee not found"));
  }
  const department = await Dept.create({
    name,
    supervisor: findEmployee.firstName.concat(" ", findEmployee.lastName),
    supervisorEmployeeId: findEmployee.employeeId,
  });
  res
    .status(201)
    .json({ department, msg: `${name} department was created successfully` });
});

export const getDepartments = tryCatch(async (req, res, next) => {
  const departments = await Dept.find();
  if (!departments) {
    return next(createHttpError(400, "No departments found"));
  }
  const getDeptNames = departments.map((dept) => dept.name);
  const user = await User.find();
  const getUserDepts = user.map((dept) => dept.dept);
  const deptCount = getUserDepts.reduce((acc, dept) => {
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  res.status(200).json({ departments, getDeptNames, deptCount });
});

export const getADepartment = tryCatch(async (req, res, next) => {
  const { departmentName } = req.params;
  if (!departmentName) {
    return next(createHttpError(400, "Department name is required"));
  }
  // const cacheDepartment = cache.get("department");
  // if (cacheDepartment) {
  //   return res.status(200).json(cacheDepartment);
  // }
  const department = await Dept.findOne({ name: departmentName });
  if (!department) {
    return next(createHttpError(400, "Department not found"));
  }
  // cache.set("department", department);
  res.status(200).json(department);
});

export const updateDepartment = tryCatch(async (req, res, next) => {
  const { departmentId } = req.params;
  const { name, employeeId } = req.body;
  if (!departmentId) {
    return next(createHttpError(400, "Dept id params is required"));
  }
  const findEmployee = await User.findOne({ employeeId });
  if (!findEmployee) {
    return next(createHttpError(400, "Employee not found"));
  }
  const updatedFields = {
    name,
    supervisor: findEmployee.firstName.concat(" ", findEmployee.lastName),
    supervisorEmployeeId: findEmployee.employeeId,
  };

  Object.keys(updatedFields).forEach(
    (key) =>
      updatedFields[key] === "" ||
      null ||
      (undefined && delete updatedFields[key])
  );
  const department = await Dept.findByIdAndUpdate(departmentId, updatedFields, {
    new: true,
  });
  res.status(200).json({ department, msg: "Department updated" });
});
