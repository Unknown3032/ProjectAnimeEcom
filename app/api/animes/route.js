import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Anime from '@/models/Anime';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 0;
    const active = searchParams.get('active') === 'true';
    const sortBy = searchParams.get('sortBy') || 'popularity';

    const query = active ? { isActive: true } : {};

    const sortOptions = {
      popularity: { popularity: -1 },
      name: { name: 1 },
      newest: { createdAt: -1 }
    };

    let animesQuery = Anime.find(query)
      .sort(sortOptions[sortBy] || sortOptions.popularity)
      .select('name slug image popularity productCount isActive');

    if (limit > 0) {
      animesQuery = animesQuery.limit(limit);
    }

    const animes = await animesQuery.lean();

    return NextResponse.json({
      success: true,
      data: animes,
      total: animes.length
    });

  } catch (error) {
    console.error('Get animes error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch animes',
        message: error.message 
      },
      { status: 500 }
    );
  }
}