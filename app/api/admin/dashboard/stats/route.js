import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    const currentMonthOrders = await Order.find({
      createdAt: { $gte: lastMonth },
      status: { $ne: 'cancelled' }
    }).lean();

    const previousMonthOrders = await Order.find({
      createdAt: { $gte: previousMonth, $lt: lastMonth },
      status: { $ne: 'cancelled' }
    }).lean();

    const currentRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const previousRevenue = previousMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : 100;

    const currentOrderCount = currentMonthOrders.length;
    const previousOrderCount = previousMonthOrders.length;
    const ordersChange = previousOrderCount > 0
      ? ((currentOrderCount - previousOrderCount) / previousOrderCount * 100).toFixed(1)
      : 100;

    const totalCustomers = await User.countDocuments({ role: 'user' });
    const newCustomers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: lastMonth }
    });

    const totalProducts = await Product.countDocuments({ status: 'published' });
    const lowStock = await Product.countDocuments({ 
      stock: { $lt: 10 }, 
      status: 'published' 
    });

    const avgOrderValue = currentOrderCount > 0 
      ? (currentRevenue / currentOrderCount).toFixed(2) 
      : 0;
    const previousAvgOrderValue = previousOrderCount > 0 
      ? (previousRevenue / previousOrderCount).toFixed(2) 
      : 0;
    const avgOrderChange = previousAvgOrderValue > 0
      ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue * 100).toFixed(1)
      : 100;

    const conversionRate = totalCustomers > 0
      ? ((currentOrderCount / totalCustomers) * 100).toFixed(1)
      : 0;

    const cancelledOrders = await Order.countDocuments({
      createdAt: { $gte: lastMonth },
      status: 'cancelled'
    });
    const returnRate = currentOrderCount > 0
      ? ((cancelledOrders / (currentOrderCount + cancelledOrders)) * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      stats: [
        {
          id: 1,
          label: 'Total Revenue',
          value: `$${currentRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
          isPositive: revenueChange >= 0,
          rawValue: currentRevenue
        },
        {
          id: 2,
          label: 'Total Orders',
          value: currentOrderCount.toLocaleString(),
          change: `${ordersChange >= 0 ? '+' : ''}${ordersChange}%`,
          isPositive: ordersChange >= 0,
          rawValue: currentOrderCount
        },
        {
          id: 3,
          label: 'Total Customers',
          value: totalCustomers.toLocaleString(),
          change: `+${newCustomers} new`,
          isPositive: true,
          rawValue: totalCustomers
        },
        {
          id: 4,
          label: 'Avg Order Value',
          value: `$${parseFloat(avgOrderValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: `${avgOrderChange >= 0 ? '+' : ''}${avgOrderChange}%`,
          isPositive: avgOrderChange >= 0,
          rawValue: parseFloat(avgOrderValue)
        }
      ],
      additionalMetrics: {
        totalProducts,
        lowStock,
        conversionRate: `${conversionRate}%`,
        returnRate: `${returnRate}%`
      }
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}