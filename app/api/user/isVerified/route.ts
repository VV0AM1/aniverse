export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import PendingVerification from "@/app/models/PendingVerification";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { verified: false, status: "none", message: "email query required" },
      { status: 400 }
    );
  }

  await dbConnect();

  const user = await Client.findOne({ email }).select("_id isVerified").lean();
  if (user?.isVerified) {
    return NextResponse.json({ verified: true, status: "verified" }, { status: 200 });
  }

  const pending = await PendingVerification.findOne({ email })
    .select("_id expiresAt")
    .lean();

  if (pending) {
    return NextResponse.json(
      {
        verified: false,
        status: "pending",
        expiresAt: pending.expiresAt?.toISOString?.() ?? null,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ verified: false, status: "none" }, { status: 200 });
}