import dotenv from "dotenv";
import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { v2 as cloudinary } from "cloudinary";
import env from "./utils/validateEnv.js";
import authRoutes from "./routes/auth.js";
import deptRoutes from "./routes/dept.js";
import eventRoutes from "./routes/event.js";
import userRoutes from "./routes/user.js";
import leaveRoutes from "./routes/leave.js";
import payrollRoutes from "./routes/payroll.js";
import taskRoutes from "./routes/task.js";

dotenv.config();
const app = express();
cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_APIKEY,
  api_secret: env.CLOUDINARY_SECRETKEY,
  secure: true,
});

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      // httpOnly: true,
      // path: "/",
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URI,
      dbName: "EMPLY",
    }),
  })
);
app.disable("x-powered-by");
app.get("/", (req, res) => {
  res.send("Hello express");
});

// Middleware to handle session errors
app.use((req, res, next) => {
  if (!req.session) {
    return next(createHttpError(500, "Session not initialized"));
  }
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/departments", deptRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/leaves", leaveRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use((req, res, next) => {
  return next(createHttpError(404, "Endpoint not found"));
});

app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "An unknown error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
