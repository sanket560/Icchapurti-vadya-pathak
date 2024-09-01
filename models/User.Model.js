import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  phoneNumber: { type: String, default: "" },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, default: "" },
  vadya: { type: String, default: "" },
  responsiblePersonName: { type: String, default: "" },
  responsiblePersonEmail: { type: String, default: "" },
  responsiblePersonPhoneNumber: { type: String, default: "" },
  isFormFilled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Fields for password reset functionality
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpire: { type: Date, default: null },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
