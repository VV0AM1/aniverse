import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?ok=0&reason=missing", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = (decoded as { userId?: string }).userId;
    if (!userId) {
      return NextResponse.redirect(new URL("/verify-email?ok=0&reason=payload", req.url));
    }

    await dbConnect();
    const user = await Client.findById(userId);
    if (!user) {
      return NextResponse.redirect(new URL("/verify-email?ok=0&reason=invalid", req.url));
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.redirect(new URL("/verify-email?ok=1", req.url));
  } catch (err) {
    console.error("❌ Verification error:", err);
    return NextResponse.redirect(new URL("/verify-email?ok=0&reason=expired", req.url));
  }
}