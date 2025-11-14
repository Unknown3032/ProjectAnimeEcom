import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/serverAuth';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
const userId = authHeader?.replace('Bearer ', '');
const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    let days = 30;
    let groupFormat = '%Y-%m-%d';
    
    if (period === '7d') {
      days = 7;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get customer growth data
    const growthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          newCustomers: { $sum: 1 },
          totalSpent: { $sum: '$totalSpent' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get active customers per day
    const activeData = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$lastLogin' } },
          activeCustomers: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Merge data
    const analyticsData = [];
    const dateMap = new Map();

    growthData.forEach(item => {
      dateMap.set(item._id, { 
        date: item._id, 
        new: item.newCustomers,
        active: 0,
        total: 0
      });
    });

    activeData.forEach(item => {
      if (dateMap.has(item._id)) {
        dateMap.get(item._id).active = item.activeCustomers;
      } else {
        dateMap.set(item._id, {
          date: item._id,
          new: 0,
          active: item.activeCustomers,
          total: 0
        });
      }
    });

    // Calculate cumulative total
    let cumulativeTotal = await User.countDocuments({ 
      createdAt: { $lt: startDate } 
    });

    Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(item => {
        cumulativeTotal += item.new;
        analyticsData.push({
          ...item,
          total: cumulativeTotal,
          date: formatDate(item.date, period)
        });
      });

    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function formatDate(dateString, period) {
  const date = new Date(dateString);
  if (period === '7d') {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return `Week ${Math.ceil(date.getDate() / 7)}`;
}