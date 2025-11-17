import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import User from '@/models/User';

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
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status');

    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    const formattedOrders = orders.map(order => {
      const user = order.user;
      const customerName = user 
        ? `${user.firstName} ${user.lastName}` 
        : (order.shippingAddress?.firstName 
          ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
          : 'Guest User');

      const firstProduct = order.items && order.items.length > 0 
        ? order.items[0].name 
        : 'N/A';

      return {
        id: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
        customer: customerName,
        email: user?.email || order.shippingAddress?.email || 'N/A',
        product: firstProduct,
        itemCount: order.items?.length || 0,
        amount: `$${order.total?.toFixed(2)}`,
        rawAmount: order.total,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        fullDate: order.createdAt,
        _id: order._id
      };
    });

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update order status
export async function PATCH(request) {
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

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.orderNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Update Order API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}