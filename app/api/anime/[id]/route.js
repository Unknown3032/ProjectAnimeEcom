// app/api/anime/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Anime from '@/models/Anime';

// Get single anime
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const anime = await Anime.findById(params.id);

    if (!anime) {
      return NextResponse.json(
        { error: 'Anime not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: anime
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch anime' },
      { status: 500 }
    );
  }
}

// Update anime
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();

    // Generate slug if name changed
    if (body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const anime = await Anime.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!anime) {
      return NextResponse.json(
        { error: 'Anime not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: anime,
      message: 'Anime updated successfully'
    });
  } catch (error) {
    console.error('Update anime error:', error);
    return NextResponse.json(
      { error: 'Failed to update anime' },
      { status: 500 }
    );
  }
}

// Delete anime
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const anime = await Anime.findByIdAndDelete(params.id);

    if (!anime) {
      return NextResponse.json(
        { error: 'Anime not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Anime deleted successfully'
    });
  } catch (error) {
    console.error('Delete anime error:', error);
    return NextResponse.json(
      { error: 'Failed to delete anime' },
      { status: 500 }
    );
  }
}