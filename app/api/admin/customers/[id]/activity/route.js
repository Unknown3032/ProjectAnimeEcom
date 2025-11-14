import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyAdminToken } from '@/lib/serverAuth';
import mongoose from 'mongoose';

export async function GET(request, context) {
  try {
    console.log('=== GET CUSTOMER ACTIVITY ===');
    
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

    // Get customer with populated data
    const customer = await User.findById(customerId)
      .lean();
    
    if (!customer) {
      return NextResponse.json({ 
        error: 'Customer not found' 
      }, { status: 404 });
    }

    console.log('2. Customer found:', customer.email);

    const activities = [];

    // Add registration activity
    activities.push({
      type: 'registration',
      text: 'Created account',
      time: customer.createdAt,
      icon: '👤',
      timeAgo: getTimeAgo(customer.createdAt)
    });

    // Add login activity
    if (customer.lastLogin) {
      activities.push({
        type: 'login',
        text: 'Logged in to account',
        time: customer.lastLogin,
        icon: '🔐',
        timeAgo: getTimeAgo(customer.lastLogin)
      });
    }

    // Add order activities
    try {
      if (Order) {
        const recentOrders = await Order.find({ user: customerId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        recentOrders.forEach(order => {
          activities.push({
            type: 'order',
            text: `Placed order ${order.orderNumber || `#${order._id.toString().slice(-6)}`}`,
            time: order.createdAt,
            icon: '📦',
            timeAgo: getTimeAgo(order.createdAt),
            data: {
              orderId: order._id,
              total: order.total
            }
          });
        });

        console.log('3. Added', recentOrders.length, 'order activities');
      }
    } catch (error) {
      console.log('Order activities not available:', error.message);
    }

    // Add wishlist activities
    if (customer.wishlist && Array.isArray(customer.wishlist)) {
      customer.wishlist.slice(0, 3).forEach(item => {
        activities.push({
          type: 'wishlist',
          text: `Added item to wishlist`,
          time: item.addedAt || customer.createdAt,
          icon: '❤️',
          timeAgo: getTimeAgo(item.addedAt || customer.createdAt),
          data: {
            productId: item.product
          }
        });
      });

      console.log('4. Added', Math.min(3, customer.wishlist.length), 'wishlist activities');
    }

    // Sort by time (most recent first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    console.log('5. Total activities:', activities.length);

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 20) // Limit to 20 most recent
    });

  } catch (error) {
    console.error('❌ Get customer activity error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch activity',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to get relative time
function getTimeAgo(date) {
  if (!date) return 'Unknown';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'Just now';
}