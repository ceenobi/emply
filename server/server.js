import app from "./src/app.js";
import { connectToDb } from "./src/config/connectDb.js";
import env from "./src/utils/validateEnv.js";

const port = process.env.PORT || 5005;

if (!port || !env.MONGO_URI || !env.SESSION_SECRET) {
  throw new Error(
    "Please ensure that you have your port, session secret and MONGODB set."
  );
}

connectToDb()
  .then(() => startServer())
  .catch((error) => {
    console.log("Invalid database connection", error);
  });

function startServer() {
  app.listen(port, (error) => {
    if (error) {
      console.log("Cannot connect to server", error);
    } else {
      console.log(`Server is connected to port ${port}`);
    }
  });
}
