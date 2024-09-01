import connectDB from "@/database/dbConfig";
import { NextResponse } from "next/server";
import Attendance from '@/models/Attendance.model';

export const dynamic = "force-dynamic";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const attendanceRecords = await Attendance.find({ userId }).sort({ date: -1 });

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
