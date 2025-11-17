// app/api/admin/orders/[orderId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

// GET - Fetch single order
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { orderId } = await params;

    console.log('🔍 Fetching order with ID:', orderId);

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required', error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order without populate first
    const order = await Order.findById(orderId).lean();

    if (!order) {
      console.log('❌ Order not found:', orderId);
      return NextResponse.json(
        { success: false, message: 'Order not found', error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', order.orderNumber);

    // Manually populate user if needed
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

    // Manually populate product details for each item
    if (order.items && order.items.length > 0) {
      const populatedItems = await Promise.all(
        order.items.map(async (item) => {
          if (item.productId) {
            try {
              const product = await Product.findById(item.productId)
                .select('name price image')
                .lean();
              
              return {
                ...item,
                product: product || null,
              };
            } catch (err) {
              console.log('Could not populate product:', err.message);
              return item;
            }
          }
          return item;
        })
      );
      
      order.items = populatedItems;
    }

    return NextResponse.json({
      success: true,
      data: order,
      order, // backward compatibility
    });

  } catch (error) {
    console.error('❌ Get order error:', error);
    return NextResponse.json(
      { success: false, message: error.message, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update order (for admin)
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required', message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Add date tracking for status changes
    const updateData = { ...body };
    
    if (body.status === 'shipped' && !body.shippedDate) {
      updateData.shippedDate = new Date();
    }
    
    if (body.status === 'delivered' && !body.deliveredDate) {
      updateData.deliveredDate = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found', message: 'Order not found' },
        { status: 404 }
      );
    }

    // Manually populate user
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

    return NextResponse.json({
      success: true,
      order,
      data: order,
      message: 'Order updated successfully',
    });

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: error.message, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required', message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found', message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { success: false, error: error.message, message: error.message },
      { status: 500 }
    );
  }
}