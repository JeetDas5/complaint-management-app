import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jeet15083011@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const adminEmail =
  process.env.ADMIN_EMAILS?.split(",")[0] || "jeetdas1508@gmail.com";

export function sendEmail(subject: string, text: string) {
  const mailOptions = {
    from: adminEmail,
    to: adminEmail,
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
