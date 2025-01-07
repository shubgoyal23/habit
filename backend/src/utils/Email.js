import nodemailer from "nodemailer";
import otpTemplate from "../emailTemplets/verificationMail.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
   host: "email-smtp.ap-south-1.amazonaws.com",
   port: 465,
   secure: true,
   auth: {
      user: process.env.AWS_SES_USER,
      pass: process.env.AWS_SES_PASS,
   },
});

const SendOtp = async (email, fullname) => {
   try {
      let otp = Math.floor(Math.random() * 1000000);
      while (otp < 100000 || otp > 999999) {
         otp = Math.floor(Math.random() * 1000000);
      }

      const mail = await transporter.sendMail({
         from: '"Habit Tracker" <Habit@proteinslice.com>',
         to: email,
         subject: "Verify Your Email",
         text: "Email verification mail from Habit Tracker",
         html: otpTemplate({ fullname: fullname, code: otp, email: email }),
      });
      return otp;
   } catch (error) {
      console.log(error);
   }
};

export { SendOtp };
