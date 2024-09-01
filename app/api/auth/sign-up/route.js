import connectDB from "@/database/dbConfig";
import User from "@/models/User.Model";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();
  const { name, email, password, role } = await req.json();
  try {
    const isUserAlreadyExist = await User.findOne({ email });

    if (isUserAlreadyExist) {
      return NextResponse.json({
        success: false,
        message: "Email already exist. Please try with different email",
      });
    } else {
      const hashPassword = await hash(password, 12);
      const newlyCreatedUser = await User.create({
        name,
        email,
        role,
        password: hashPassword,
      });
      if (newlyCreatedUser) {
        return NextResponse.json({
          success: true,
          message: "Account created Successfully",
        });
      }
    }
  } catch (error) {
    console.log("error in creating new user registration", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! please try again later",
    });
  }
}
