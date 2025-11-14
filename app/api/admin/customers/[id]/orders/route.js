import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyAdminToken } from '@/lib/serverAuth';
import mongoose from 'mongoose';

export async function GET(request, context) {
  try {
    console.log('=== GET CUSTOMER ORDERS ===');
    
    // Await params
    const params = await context.params;
    const customerId = params?.id;
    
    console.log('1. Customer ID:', customerId);

    // Get auth
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');
    
    const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Validate customer ID
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ 
        error: 'Invalid customer ID' 
      }, { status: 400 });
    }

    // Check if customer exists
    const customer = await User.findById(customerId);
    
    if (!customer) {
      return NextResponse.json({ 
        error: 'Customer not found' 
      }, { status: 404 });
    }

    console.log('2. Customer found:', customer.email);

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Check if Order model exists
    let orders = [];
    let total = 0;

    try {
      // Try to get orders from Order collection
      if (Order) {
        const orderQuery = { user: customerId };
        
        [orders, total] = await Promise.all([
          Order.find(orderQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          Order.countDocuments(orderQuery)
        ]);

        console.log('3. Found', orders.length, 'orders from Order collection');
      }
    } catch (error) {
      console.log('Order model not available:', error.message);
      
      // Fallback: use orders from user document
      if (customer.orders && Array.isArray(customer.orders)) {
        total = customer.orders.length;
        orders = customer.orders.slice(skip, skip + limit);
        console.log('3. Using orders from user document:', orders.length);
      }
    }

    // Format orders
    const formattedOrders = orders.map(order => {
      // Handle both Order model and simple order references
      if (order._id) {
        return {
          id: order._id.toString(),
          orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
          date: order.createdAt || new Date(),
          items: order.items?.length || 0,
          total: order.total || 0,
          status: order.status || 'pending',
          shippingAddress: order.shippingAddress || null,
          products: order.items?.map(item => ({
            name: item.name || item.product?.name || 'Unknown Product',
            quantity: item.quantity || 1,
            price: item.price || 0
          })) || []
        };
      }
      
      // If order is just an ObjectId reference
      return {
        id: order.toString(),
        orderNumber: `ORD-${order.toString().slice(-6).toUpperCase()}`,
        date: new Date(),
        items: 0,
        total: 0,
        status: 'unknown',
        shippingAddress: null,
        products: []
      };
    });

    console.log('4. Formatted', formattedOrders.length, 'orders');

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get customer orders error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        message: error.message 
      },
      { status: 500 }
    );
  }
}