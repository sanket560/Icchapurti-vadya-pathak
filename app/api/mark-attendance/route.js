import connectDB from "@/database/dbConfig";
import { NextResponse } from "next/server";
import Attendance from "@/models/Attendance.model";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();
  try {
    const { userId, action } = await req.json();
    const currentDate = new Date().toDateString();

    let attendance = await Attendance.findOne({
      userId,
      date: currentDate,
    });

    if (!attendance) {
      // If no attendance record for today, create a new one
      attendance = new Attendance({
        userId,
        date: currentDate,
      });
    }

    if (action === "entered") {
      attendance.entryTime = new Date();
    } else if (action === "left") {
      attendance.exitTime = new Date();
    }

    // Save the status as "Pending" when marking attendance
    attendance.status = "Pending";

    await attendance.save();

    return NextResponse.json({
      success: true,
      message: `Successfully marked as ${action}`,
    });
  } catch (error) {
    console.error("Error marking attendance", error);
    return NextResponse.json({
      success: false,
      message: "Failed to mark attendance",
    });
  }
}
