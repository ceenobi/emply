import env from "../../utils/validateEnv.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export const mailGenerator = new Mailgen({
  theme: "salted",
  product: {
    name: "EMPLY",
    link: "https://teem-seller.vercel.app",
  },
});

export const transporter = nodemailer.createTransport({
  host: env.BREVO_MAIL_HOST,
  port: env.BREVO_MAIL_PORT,
  auth: {
    user: env.BREVO_MAIL_LOGIN,
    pass: env.BREVO_MAIL_APIKEY,
  },
});
