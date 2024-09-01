import connectDB from "@/database/dbConfig";
import User from "@/models/User.Model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();
  try {
    const { userId, phoneNumber, dateOfBirth, gender, vadya, responsiblePersonEmail, responsiblePersonName, responsiblePersonPhoneNumber,isFormFilled, } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // Update user details
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    user.vadya = vadya || user.vadya;
    user.responsiblePersonName = responsiblePersonName || user.responsiblePersonName;
    user.responsiblePersonEmail = responsiblePersonEmail || user.responsiblePersonEmail;
    user.responsiblePersonPhoneNumber = responsiblePersonPhoneNumber || user.responsiblePersonPhoneNumber;
    user.isFormFilled = isFormFilled || user.isFormFilled;

    await user.save();


    return NextResponse.json({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log("Error in updating user's profile data", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
}
