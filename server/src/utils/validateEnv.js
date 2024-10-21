import { cleanEnv } from "envalid";
import { str } from "envalid/dist/validators.js";

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  SESSION_SECRET: str(),
  JWT_SECRET: str(),
  NODE_ENV: str(),
  CLOUDINARY_NAME: str(),
  CLOUDINARY_APIKEY: str(),
  CLOUDINARY_SECRETKEY: str(),
  CLOUDINARY_UPLOAD_PRESET: str(),
  BREVO_MAIL_HOST: str(),
  BREVO_MAIL_PORT: str(),
  BREVO_MAIL_LOGIN: str(),
  BREVO_MAIL_APIKEY: str(),
  CLIENT_URL: str(),
});
