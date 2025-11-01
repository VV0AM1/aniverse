import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ verified: false, message: "email query required" }, { status: 400 });
  }
  await dbConnect();
  const user = await Client.findOne({ email }).select("isVerified");
  return NextResponse.json({ verified: !!user?.isVerified });
}
