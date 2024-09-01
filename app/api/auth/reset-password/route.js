import { resetUserPassword } from "@/lib/auth/resetUserPassword";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, token } = body;

    if (!password || !token) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    await resetUserPassword(token, password);

    return NextResponse.json({ success: true, message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ success: false, message: "Error resetting password." }, { status: 500 });
  }
}
