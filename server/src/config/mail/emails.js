import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailGenerator, transporter } from "./sendMail.config.js";
import env from "../../utils/validateEnv.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const sendEmail = {
    body: {
      intro: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    },
  };
  const emailBody = mailGenerator.generate(sendEmail);
  try {
    const mailOptions = {
      from: env.BREVO_MAIL_LOGIN,
      to: email,
      subject: "Email Verification",
      html: emailBody,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, firstName, lastName) => {
  const sendEmail = {
    body: {
      name: `${firstName + " " + lastName}`,
      intro: "Your Email has been verified!",
    },
  };
  const emailBody = mailGenerator.generate(sendEmail);
  try {
    const mailOptions = {
      from: env.BREVO_MAIL_LOGIN,
      to: email,
      subject: "Email Verification status",
      html: emailBody,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (
  email,
  firstName,
  lastName,
  resetURL
) => {
  const sendEmail = {
    body: {
      name: `${firstName + " " + lastName}`,
      intro: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    },
  };
  const emailBody = mailGenerator.generate(sendEmail);
  try {
    const mailOptions = {
      from: env.BREVO_MAIL_LOGIN,
      to: email,
      subject: "Your password reset link",
      html: emailBody,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Password reset email link sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email, firstName, lastName) => {
  const sendEmail = {
    body: {
      name: `${firstName + " " + lastName}`,
      intro: PASSWORD_RESET_SUCCESS_TEMPLATE,
    },
  };
  const emailBody = mailGenerator.generate(sendEmail);
  try {
    const mailOptions = {
      from: env.BREVO_MAIL_LOGIN,
      to: email,
      subject: "Password Reset Successfull",
      html: emailBody,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
