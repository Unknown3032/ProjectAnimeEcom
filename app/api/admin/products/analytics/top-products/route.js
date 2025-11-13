import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const topProducts = await Product.find({ status: 'published' })
      .select('name sku price purchases rating')
      .sort('-purchases')
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch top products' }, { status: 500 });
  }
}