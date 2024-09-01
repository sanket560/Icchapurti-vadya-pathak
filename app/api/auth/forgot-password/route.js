import { sendPasswordResetEmail } from "@/lib/auth/sendPasswordResetEmail";
import User from "@/models/User.Model";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email } = await request.json();

  const user = await User.findOne({ email });

  if(!user){
    return NextResponse.json({sucess:false, message : "User not found. Please create new account"})
  }

  try {
    await sendPasswordResetEmail(email);
    return NextResponse.json({ success: true, message: "Password reset link sent to your email." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error sending password reset link." });
  }
}