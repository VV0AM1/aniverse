export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import PendingVerification from "@/app/models/PendingVerification";
import { pusher } from "@/app/lib/pusher";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");
  if (!email || !token) {
    return NextResponse.redirect(new URL("/verify-email?ok=0&reason=missing", req.url));
  }

  try {
    await dbConnect();

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const pending = await PendingVerification.findOne({ email }).lean();

    if (!pending || pending.tokenHash !== tokenHash) {
      return NextResponse.redirect(new URL("/verify-email?ok=0&reason=invalid", req.url));
    }

    if (pending.expiresAt.getTime() < Date.now()) {
      await PendingVerification.deleteOne({ email });
      return NextResponse.redirect(new URL("/verify-email?ok=0&reason=expired", req.url));
    }

    const existing = await Client.findOne({ email });
    if (existing) {
      existing.isVerified = true;
      await existing.save();
    } else {
      await Client.create({
        email,
        nickname: pending.nickname,
        password: pending.passwordHash,
        isVerified: true,
      });
    }

    await PendingVerification.deleteOne({ email });

    await pusher.trigger(channelForEmail(email), "verified", { email, at: Date.now() });

    return NextResponse.redirect(new URL("/verify-email?ok=1", req.url));
  } catch (err) {
    console.error("❌ Verify error:", err);
    return NextResponse.redirect(new URL("/verify-email?ok=0&reason=error", req.url));
  }
}

function channelForEmail(email: string) {
  return `verify-${email.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}