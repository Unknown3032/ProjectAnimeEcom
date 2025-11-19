import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';

// POST - Reorder categories
export async function POST(request) {
  try {
    await dbConnect();

    const { orders } = await request.json();
    // orders format: [{ id: 'categoryId', order: 1 }, ...]

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid orders data' 
        },
        { status: 400 }
      );
    }

    // Update each category's order
    const updatePromises = orders.map(({ id, order }) =>
      Category.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Categories reordered successfully'
    });

  } catch (error) {
    console.error('Reorder categories error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reorder categories',
        message: error.message 
      },
      { status: 500 }
    );
  }
}