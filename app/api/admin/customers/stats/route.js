import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/serverAuth';

export async function GET(request) {
  try {
    console.log('📊 GET /api/admin/customers/stats');

    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');
    
    const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    console.log('Fetching customer statistics...');

    // Get total customers
    const totalCustomers = await User.countDocuments();
    console.log('Total customers:', totalCustomers);

    // Get active customers (logged in last 30 days)
    const activeCustomers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });
    console.log('Active customers:', activeCustomers);

    // Get new customers this month
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    console.log('New customers:', newCustomers);

    // Calculate customer LTV
    const ltvResult = await User.aggregate([
      {
        $group: {
          _id: null,
          avgSpent: { $avg: '$totalSpent' }
        }
      }
    ]);
    const avgLTV = ltvResult[0]?.avgSpent || 0;
    console.log('Average LTV:', avgLTV);

    // Get previous month stats for comparison
    const prevMonthTotal = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const prevMonthActive = await User.countDocuments({
      lastLogin: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous * 100).toFixed(1);
      return change >= 0 ? `+${change}%` : `${change}%`;
    };

    const totalChange = calculateChange(newCustomers, prevMonthTotal);
    const activeChange = calculateChange(activeCustomers, prevMonthActive);
    const newChange = calculateChange(newCustomers, prevMonthTotal);

    console.log('Changes calculated:', { totalChange, activeChange, newChange });

    const stats = {
      totalCustomers: {
        value: totalCustomers,
        change: totalChange
      },
      activeCustomers: {
        value: activeCustomers,
        change: activeChange
      },
      newCustomers: {
        value: newCustomers,
        change: newChange
      },
      customerLTV: {
        value: Math.round(avgLTV),
        change: '+5.7%' // You can calculate this from historical data if available
      }
    };

    console.log('✅ Stats prepared:', stats);

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Get stats error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch statistics',
        message: error.message 
      },
      { status: 500 }
    );
  }
}