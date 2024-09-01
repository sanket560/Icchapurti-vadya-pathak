import crypto from "crypto";
import bcrypt from "bcryptjs"; // For hashing the new password
import connectDB from "@/database/dbConfig";
import User from "@/models/User.Model";

export async function resetUserPassword(token, newPassword) {
  await connectDB();

  // Hash the token to compare with the one in the database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Debug: Log the hashed token
  console.log("Hashed Token: ", hashedToken);

  // Find the user with this reset token and check if the token is still valid
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }, // Ensure the token has not expired
  });

  if (user) {
    console.log("User found:", user);
    console.log("Reset Password Token in DB:", user.resetPasswordToken);
    console.log("Reset Password Expiry in DB:", user.resetPasswordExpire);
  } else {
    console.error("User not found or token expired.");
    throw new Error("Invalid or expired password reset token.");
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear the reset token and its expiration
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
}
