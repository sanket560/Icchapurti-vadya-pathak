import nodemailer from "nodemailer";
import crypto from "crypto";
import connectDB from "@/database/dbConfig";
import User from "@/models/User.Model";

export async function sendPasswordResetEmail(email) {
  await connectDB();

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No user found with this email.");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token before saving to database for security
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set the token and its expiration time on the user object
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token expires in 30 minutes

  await user.save();

  // Create the reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/auth/reset-password?token=${resetToken}`;

  // Configure your email transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>You have requested a password reset. Please click the following link to reset your password:</p>
           <a href="${resetUrl}">Reset Password</a>
           <p>If you did not request this, please ignore this email.</p>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}
