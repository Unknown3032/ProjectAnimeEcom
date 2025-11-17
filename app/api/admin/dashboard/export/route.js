import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import User from '@/models/User';
import dbConnect from '@/lib/connectDb';

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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'orders'; // orders, customers, products
    const format = searchParams.get('format') || 'json'; // json, csv
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let data = [];

    if (type === 'orders') {
      const query = {};
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const orders = await Order.find(query)
        .populate('user', 'firstName lastName email')
        .sort('-createdAt');

      data = orders.map(order => ({
        orderNumber: order.orderNumber,
        customer: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest',
        email: order.user?.email || 'N/A',
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: order.items.length,
        date: order.createdAt.toISOString()
      }));
    }

    if (format === 'csv') {
      // Convert to CSV
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-${Date.now()}.csv"`
        }
      });
    }

    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    console.error('Export API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}