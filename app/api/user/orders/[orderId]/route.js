// app/api/user/orders/[orderId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';

export async function GET(request, context) {
  try {
    await dbConnect();

    // Await params in Next.js 15+
    const { orderId } = await context.params;

    const order = await Order.findById(orderId).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Cancel order
export async function PATCH(request, context) {
  try {
    await dbConnect();

    // Await params in Next.js 15+
    const { orderId } = await context.params;
    const body = await request.json();
    const { action, userId } = body;

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify user owns this order
    if (order.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (action === 'cancel') {
      // Only allow cancellation if order is pending or processing
      if (!['pending', 'processing'].includes(order.status)) {
        return NextResponse.json(
          { success: false, error: 'Cannot cancel this order' },
          { status: 400 }
        );
      }

      order.status = 'cancelled';
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        order
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}