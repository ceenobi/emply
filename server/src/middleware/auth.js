import createHttpError from "http-errors";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.js";

export const requiresAuth =
  (roles = []) =>
  async (req, res, next) => {
    if (!Array.isArray(roles)) roles = [roles];
    try {
      const token = req.session.token;
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return next(createHttpError(401, "User not authenticated"));
      }
      const checkRole = await User.findById(decoded.userId);
      if (!checkRole || !checkRole.role) {
        return next(createHttpError(403, "Error: Role missing"));
      }
      if (!roles.includes(checkRole.role))
        return next(
          createHttpError(401, "You are not authorized for this request")
        );
      req.userId = decoded.userId;
      next();
    } catch (error) {
      next(createHttpError(403, "Session expired, pls log in"));
    }
  };

export const Roles = {
  User: ["user"],
  Admin: ["admin", "super-admin"],
  Super: ["super-admin"],
  All: ["user", "admin", "super-admin"],
};
