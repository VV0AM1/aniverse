import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, nickname } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    let user = await Client.findOne({ email });

    if (!user) {
      user = await Client.create({
        email,
        nickname: nickname || email.split("@")[0],
        password: "",            
        isVerified: true,
        createdAt: new Date(),
      });
    }

    const userId = String(user._id);

    const token = jwt.sign(
      { userId, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        token,
        nickname: user.nickname,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ googleToken error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
