// app/api/admin/orders/[orderId]/status/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import User from '@/models/User';

// PATCH - Update order status
export async function PATCH(request, context) {
  try {
    await dbConnect();

    const { orderId } = await context.params;
    const body = await request.json();

    console.log('📝 Updating order status:', orderId, body);

    // Validation
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!body.status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    // Valid statuses
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      status: body.status,
    };

    // Add tracking number if provided
    if (body.trackingNumber) {
      updateData.trackingNumber = body.trackingNumber;
    }

    // Add admin notes if provided
    if (body.adminNotes) {
      updateData.adminNotes = body.adminNotes;
    }

    // Auto-set dates based on status
    if (body.status === 'shipped' && !order.shippedDate) {
      updateData.shippedDate = new Date();
    }

    if (body.status === 'delivered' && !order.deliveredDate) {
      updateData.deliveredDate = new Date();
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    // Manually populate user
    if (updatedOrder.userId || updatedOrder.user) {
      const userId = updatedOrder.userId || updatedOrder.user;
      try {
        const user = await User.findById(userId)
          .select('firstName lastName email name')
          .lean();
        if (user) {
          updatedOrder.user = user;
        }
      } catch (err) {
        console.log('Could not populate user:', err.message);
      }
    }

    console.log('✅ Order status updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
      order: updatedOrder,
    });

  } catch (error) {
    console.error('❌ Update order status error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET - Get order status
export async function GET(request, context) {
  try {
    await dbConnect();

    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId)
      .select('orderNumber status orderDate shippedDate deliveredDate trackingNumber adminNotes')
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        currentStatus: order.status,
        dates: {
          ordered: order.orderDate,
          shipped: order.shippedDate,
          delivered: order.deliveredDate,
        },
        trackingNumber: order.trackingNumber,
        adminNotes: order.adminNotes,
      },
    });

  } catch (error) {
    console.error('Get order status error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}