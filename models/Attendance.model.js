import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  entryTime: { type: Date, default: null },
  exitTime: { type: Date, default: null },
  status: { type: String, default: "Pending" }, // Default status is "Pending"
  createdAt: { type: Date, default: Date.now },
});

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
export default Attendance;
