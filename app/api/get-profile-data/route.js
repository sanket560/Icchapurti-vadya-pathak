import connectDB from "@/database/dbConfig";
import User from "@/models/User.Model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("Error in getting user's profile data:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
