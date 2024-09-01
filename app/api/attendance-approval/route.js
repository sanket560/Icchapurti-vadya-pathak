import connectDB from "@/database/dbConfig";
import Attendance from "@/models/Attendance.model";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET(req) {
  await connectDB();
  try {
    const attendanceRecords = await Attendance.find()
      .populate("userId", "name")
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance records", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch attendance records",
    });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const { attendanceId, status } = await req.json();

    // Update the attendance status
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      { status },
      { new: true }
    ).populate("userId");

    // Extract required fields for email
    const {
      userId: { name, responsiblePersonEmail },
      entryTime,
      exitTime,
    } = updatedAttendance;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let subject = "";
    let text = "";

    if (status === "Approved") {
      // Format times
      const formattedEntryTime = new Date(entryTime).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      const formattedExitTime = exitTime
        ? new Date(exitTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";

      subject = `आजची उपस्थिती: ${name}`;
      text = `प्रिय पालक,\n\nआपल्या मुलाने/मुलीने खालील वेळेत सरावासाठी हजेरी लावली आणि या वेळेस सराव सोडला:\nप्रवेश वेळ: ${formattedEntryTime}\nनिर्गम वेळ: ${formattedExitTime}\n\nधन्यवाद,\nआपली टीम.`;
    } else if (status === "Rejected") {
      subject = `आजची उपस्थिती: ${name}`;
      text = `प्रिय पालक,\n\nआपल्या मुलाने/मुलीने आजच्या सरावासाठी हजेरी लावली नाही. कृपया अनावश्यक सुट्ट्या घेऊ नका.\n\nधन्यवाद,\nआपली टीम.`;
    }

    // Compose and send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: responsiblePersonEmail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating attendance status", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update attendance status",
    });
  }
}
