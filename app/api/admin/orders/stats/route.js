import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30days';

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case '7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Get total orders
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get total revenue
    const revenueData = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Get orders trend data
    const trendData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalOrders: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 }
    ]);

    // Format stats
    const stats = {
      totalOrders,
      pending: ordersByStatus.find(s => s._id === 'pending')?.count || 0,
      processing: ordersByStatus.find(s => s._id === 'processing')?.count || 0,
      shipped: ordersByStatus.find(s => s._id === 'shipped')?.count || 0,
      delivered: ordersByStatus.find(s => s._id === 'delivered')?.count || 0,
      cancelled: ordersByStatus.find(s => s._id === 'cancelled')?.count || 0,
      totalRevenue,
      trendData,
      topProducts
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}