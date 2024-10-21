import mongoose from "mongoose";
import env from "../utils/validateEnv.js";

const mongoUri = env.MONGO_URI;
const connection = {};

export const connectToDb = async () => {
  if (connection.isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  let db;
  try {
    connection.isConnected = true;
    db = await mongoose.connect(mongoUri, {
      dbName: "EMPLY",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error)
    // throw new Error(error);
  } finally {
    connection.isConnected = db.connections[0].readyState;
  }
};
