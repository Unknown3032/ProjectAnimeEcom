import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import Category from '@/models/Category';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate orders by category
    const categoryRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['delivered', 'shipped', 'processing'] }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.categoryRef',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: {
          path: '$categoryInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$categoryInfo._id',
          category: { $first: '$categoryInfo.name' },
          revenue: { 
            $sum: { 
              $multiply: ['$items.quantity', '$items.price'] 
            } 
          },
          orders: { $sum: 1 },
          units: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Format the data
    const formattedData = categoryRevenue.map(item => ({
      category: item.category || 'Uncategorized',
      revenue: Math.round(item.revenue),
      orders: item.orders,
      units: item.units,
      avgOrderValue: item.orders > 0 ? Math.round(item.revenue / item.orders) : 0
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      period: period
    });

  } catch (error) {
    console.error('Error fetching category revenue:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category revenue',
      details: { message: error.message }
    }, { status: 500 });
  }
}