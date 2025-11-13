import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const [total, inStock, lowStock, outOfStock, categories] = await Promise.all([
      Product.countDocuments({ status: { $ne: 'archived' } }),
      Product.countDocuments({ stock: { $gte: 10 }, status: { $ne: 'archived' } }),
      Product.countDocuments({ stock: { $gt: 0, $lt: 10 }, status: { $ne: 'archived' } }),
      Product.countDocuments({ stock: 0, status: { $ne: 'archived' } }),
      Product.distinct('category', { status: { $ne: 'archived' } }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: total || 0,
        inStock: inStock || 0,
        lowStock: lowStock || 0,
        outOfStock: outOfStock || 0,
        categories: categories.length || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats',
        stats: {
          total: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          categories: 0,
        }
      }, 
      { status: 500 }
    );
  }
}