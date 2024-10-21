import Dept from "../models/dept.js";
import createHttpError from "http-errors";
import NodeCache from "node-cache";
import tryCatch from "../utils/tryCatchFn.js";

const cache = new NodeCache({ stdTTL: 600 });

export const createDepartment = tryCatch(async (req, res, next) => {
  const { name, photo } = req.body;
  if (!name) {
    return next(createHttpError(400, "Department name is required"));
  }
  const department = await Dept.create({ name, photo });
  if (!department) {
    return next(createHttpError(400, "Error creating department"));
  }
  res.status(201).json(department);
});

export const getDepartments = tryCatch(async (req, res, next) => {
  const cacheDepartments = cache.get("departments");
  if (cacheDepartments) {
    return res.status(200).json(cacheDepartments);
  }
  const departments = await Dept.find();
  if (!departments) {
    return next(createHttpError(400, "No departments found"));
  }
  cache.set("departments", departments);
  res.status(200).json(departments);
});
