// app/api/anime/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import Anime from "@/models/Anime";

// GET - Fetch all anime with filters and pagination
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "-popularity";

    const skip = (page - 1) * limit;

    // Build query object
    let query = { isActive: true };

    // Add search functionality
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { englishName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add genre filter
    if (genre && genre.trim()) {
      query.genre = genre;
    }

    // Add status filter
    if (status && status.trim()) {
      query.status = status;
    }

    console.log("Query:", query);
    console.log("Sort:", sortBy);

    // Fetch animes with pagination
    const animes = await Anime.find(query)
      .sort(sortBy)
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    // Get total count for pagination
    const total = await Anime.countDocuments(query);

    console.log(`Found ${animes.length} animes out of ${total} total`);

    return NextResponse.json(
      {
        success: true,
        data: animes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get anime error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch anime",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Add new anime
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, description, image, genre, studio, releaseYear } = body;

    // Validate required fields
    if (!name || !image) {
      return NextResponse.json(
        {
          success: false,
          error: "Anime name and image are required",
        },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if anime already exists
    const existingAnime = await Anime.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingAnime) {
      return NextResponse.json(
        {
          success: false,
          error: "Anime with this name already exists",
        },
        { status: 409 }
      );
    }

    // Create new anime
    const anime = await Anime.create({
      name,
      slug,
      japaneseName: body.japaneseName || "",
      englishName: body.englishName || name,
      description: description || "",
      image,
      banner: body.banner || "",
      genre: Array.isArray(genre) ? genre : [],
      studio: studio || "",
      releaseYear: releaseYear || new Date().getFullYear(),
      status: body.status || "Ongoing",
      episodes: body.episodes || 0,
      rating: body.rating || 0,
      popularity: body.popularity || 0,
      productCount: 0,
      isActive: true,
    });

    console.log("Anime created:", anime.name);

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

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Anime with this name or slug already exists",
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: messages,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create anime",
        message: error.message,
      },
      { status: 500 }
    );
  }
}