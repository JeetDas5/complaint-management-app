import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jeet15083011@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: "jeet15083011@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email:", error);
    }
    console.log("Email sent successfully:", info.response);
  });
}
