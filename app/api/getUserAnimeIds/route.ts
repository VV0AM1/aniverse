export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client, { type IClient } from "@/app/models/Client";

const CATEGORIES = ["liked", "watched", "bookmark", "later"] as const;
type Category = (typeof CATEGORIES)[number];
const isCategory = (v: unknown): v is Category =>
  typeof v === "string" && (CATEGORIES as readonly string[]).includes(v);

export async function POST(req: NextRequest) {
  try {
    const { nickname, category } = await req.json();

    if (!nickname || !category) {
      return NextResponse.json(
        { message: "nickname and category are required" },
        { status: 400 }
      );
    }
    if (!isCategory(category)) {
      return NextResponse.json(
        { message: "invalid category", allowed: CATEGORIES },
        { status: 400 }
      );
    }

    await dbConnect();

    const client = await Client.findOne({ nickname })
      .select("animeStatus")
      .lean<IClient | null>();

    if (!client) {
      return NextResponse.json({ animeIds: [] }, { status: 200 });
    }

    const animeIds = client.animeStatus?.[category] ?? [];

    return NextResponse.json({ animeIds }, { status: 200 });
  } catch (err) {
    console.error("getUserAnimeIds error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}