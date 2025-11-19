import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    // Use 'id' not 'productId'
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    await Product.findByIdAndUpdate(id, {
      $inc: { views: 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'View counted'
    }, { status: 200 });

  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to increment views'
    }, { status: 500 });
  }
}