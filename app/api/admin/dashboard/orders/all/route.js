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
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || '-createdAt';

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get orders
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .sort(sortBy)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Search in results if search term provided
    let filteredOrders = orders;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = orders.filter(order => {
        const orderNum = order.orderNumber?.toLowerCase() || '';
        const customerName = order.user 
          ? `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
          : '';
        const email = order.user?.email?.toLowerCase() || '';
        
        return orderNum.includes(searchLower) || 
               customerName.includes(searchLower) || 
               email.includes(searchLower);
      });
    }

    const formattedOrders = filteredOrders.map(order => {
      const user = order.user;
      const customerName = user 
        ? `${user.firstName} ${user.lastName}` 
        : (order.shippingAddress?.firstName 
          ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
          : 'Guest User');

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        customer: customerName,
        email: user?.email || 'N/A',
        items: order.items,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });

    // Calculate summary stats
    const stats = {
      totalOrders: total,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      avgOrderValue: orders.length > 0 
        ? (orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toFixed(2)
        : 0
    };

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total: search ? filteredOrders.length : total,
        page,
        pages: Math.ceil((search ? filteredOrders.length : total) / limit),
        limit
      },
      stats
    });
  } catch (error) {
    console.error('Get All Orders API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}