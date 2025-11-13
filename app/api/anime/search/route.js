import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import Anime from "@/models/Anime";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const animes = await Anime.find({
      $or: [
        { name: new RegExp(query, "i") },
        { englishName: new RegExp(query, "i") },
        { japaneseName: new RegExp(query, "i") },
      ],
      isActive: true,
    })
      .select("name slug image")
      .limit(10)
      .sort("-popularity");

    return NextResponse.json({
      success: true,
      data: animes,
    });
  } catch (error) {
    console.error("Search anime error:", error);
    return NextResponse.json(
      { error: "Failed to search anime" },
      { status: 500 }
    );
  }
}
