import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/connectDb';
import Anime from '@/models/Anime';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, description, image, genre, studio, releaseYear } = body;

    if (!name || !image) {
      return NextResponse.json(
        { error: 'Anime name and image are required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if anime exists
    const existingAnime = await Anime.findOne({ 
      $or: [{ name }, { slug }] 
    });

    if (existingAnime) {
      return NextResponse.json(
        { 
          success: true,
          data: existingAnime,
          message: 'Anime already exists' 
        },
        { status: 200 }
      );
    }

    const anime = await Anime.create({
      name,
      slug,
      japaneseName: body.japaneseName || '',
      englishName: body.englishName || name,
      description: description || '',
      image,
      banner: body.banner || '',
      genre: genre || [],
      studio: studio || '',
      releaseYear: releaseYear || new Date().getFullYear(),
      status: body.status || 'Ongoing',
      episodes: body.episodes || 0,
      rating: body.rating || 0
    });

    return NextResponse.json({
      success: true,
      data: anime,
      message: 'Anime created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Add anime error:', error);
    return NextResponse.json(
      { error: 'Failed to create anime' },
      { status: 500 }
    );
  }
}