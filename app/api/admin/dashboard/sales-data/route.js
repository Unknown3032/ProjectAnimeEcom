import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    const now = new Date();
    let startDate, groupBy, dateFormat;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        dateFormat = '%Y-%m-%d';
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = 'week';
        dateFormat = '%Y-%U';
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        groupBy = 'month';
        dateFormat = '%Y-%m';
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        groupBy = 'quarter';
        dateFormat = '%Y-%m';
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = 'week';
        dateFormat = '%Y-%U';
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          sales: { $sum: '$total' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const formattedData = salesData.map((item, index) => ({
      date: formatDateLabel(item._id, groupBy, index, startDate),
      sales: Math.round(item.sales),
      orders: item.orders,
      avgOrderValue: Math.round(item.avgOrderValue)
    }));

    return NextResponse.json({ success: true, data: formattedData, period });
  } catch (error) {
    console.error('Sales Data API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

function formatDateLabel(dateStr, groupBy, index, startDate) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (groupBy === 'day') {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return days[date.getDay()];
  } else if (groupBy === 'week') {
    return `Week ${index + 1}`;
  } else if (groupBy === 'month') {
    const monthIndex = parseInt(dateStr.split('-')[1]) - 1;
    return months[monthIndex];
  } else {
    const quarter = Math.floor(index / 3) + 1;
    return `Q${quarter}`;
  }
}