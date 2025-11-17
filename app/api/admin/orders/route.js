// app/api/admin/orders/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

// GET - Fetch all orders with filters
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const dateRange = searchParams.get('dateRange');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build query
    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
        { 'shippingInfo.firstName': { $regex: search, $options: 'i' } },
        { 'shippingInfo.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case '7days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch orders without populate
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Manually populate user for each order
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (order.userId || order.user) {
          const userId = order.userId || order.user;
          try {
            const user = await User.findById(userId)
              .select('firstName lastName email name')
              .lean();
            if (user) {
              order.user = user;
            }
          } catch (err) {
            console.log('Could not populate user:', err.message);
          }
        }
        return order;
      })
    );

    // Get total count
    const totalOrders = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      orders: populatedOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        ordersPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const order = await Order.create(body);

    return NextResponse.json({
      success: true,
      order
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}