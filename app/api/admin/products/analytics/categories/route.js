import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const categoryData = await Product.aggregate([
      {
        $match: { status: 'published' },
      },
      {
        $group: {
          _id: '$category',
          products: { $sum: 1 },
          revenue: { $sum: { $multiply: ['$price', { $ifNull: ['$purchases', 0] }] } },
          totalStock: { $sum: '$stock' },
        },
      },
      {
        $project: {
          category: '$_id',
          products: 1,
          revenue: { $round: ['$revenue', 2] },
          totalStock: 1,
          _id: 0,
        },
      },
      {
        $sort: { revenue: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return NextResponse.json({
      success: true,
      data: categoryData,
    });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}