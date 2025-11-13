import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import Anime from "@/models/Anime";

// Get all anime
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "-popularity";

    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (genre) {
      query.genre = genre;
    }

    if (status) {
      query.status = status;
    }

    const animes = await Anime.find(query).sort(sortBy).limit(limit).skip(skip);

    const total = await Anime.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: animes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get anime error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime" },
      { status: 500 }
    );
  }
}

// Add new anime
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, description, image, genre, studio, releaseYear } = body;

    if (!name || !image) {
      return NextResponse.json(
        { error: "Anime name and image are required" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if anime exists
    const existingAnime = await Anime.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingAnime) {
      return NextResponse.json(
        { error: "Anime already exists" },
        { status: 409 }
      );
    }

    const anime = await Anime.create({
      name,
      slug,
      japaneseName: body.japaneseName || "",
      englishName: body.englishName || name,
      description: description || "",
      image,
      banner: body.banner || "",
      genre: genre || [],
      studio: studio || "",
      releaseYear: releaseYear || new Date().getFullYear(),
      status: body.status || "Ongoing",
      episodes: body.episodes || 0,
      rating: body.rating || 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: anime,
        message: "Anime created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add anime error:", error);
    return NextResponse.json(
      { error: "Failed to create anime" },
      { status: 500 }
    );
  }
}
