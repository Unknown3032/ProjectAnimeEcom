import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    const userId = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const adminUser = await User.findById(userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Customer acquisition over time
    const customerGrowth = await User.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Fill missing dates with 0
    const filledCustomerGrowth = fillMissingDates(customerGrowth, last30Days, now);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    // Average order value trend
    const avgOrderTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          avgOrder: { $avg: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    return NextResponse.json({
      revenueByCategory: revenueByCategory.map(cat => ({
        category: cat._id || 'Uncategorized',
        revenue: Math.round(cat.revenue),
        orders: cat.orders
      })),
      customerGrowth: filledCustomerGrowth.map(day => ({
        date: formatDate(day._id),
        newCustomers: day.newCustomers
      })),
      orderStatusDistribution: orderStatusDistribution.map(status => ({
        status: status._id,
        count: status.count,
        revenue: Math.round(status.revenue)
      })),
      avgOrderTrend: avgOrderTrend.map(day => ({
        date: formatDate(day._id),
        avgOrder: Math.round(day.avgOrder),
        orders: day.orders
      }))
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function fillMissingDates(data, startDate, endDate) {
  const result = [];
  const dataMap = new Map(data.map(item => [item._id, item.newCustomers]));
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    result.push({
      _id: dateStr,
      newCustomers: dataMap.get(dateStr) || 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}