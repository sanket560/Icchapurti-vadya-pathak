import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const mail = await transport.sendMail({
      from: email,
      to: process.env.SMTP_EMAIL,
      replyTo: email,
      subject: `Message from ${name}`,
      text: message,
    });

    return NextResponse.json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error sending email" }, { status: 500 });
  }
}