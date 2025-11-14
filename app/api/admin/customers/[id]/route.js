import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/serverAuth';
import mongoose from 'mongoose';

// GET single customer
export async function GET(request, context) {
  try {
    console.log('=== GET CUSTOMER BY ID ===');
    
    // Await params in Next.js 15+
    const params = await context.params;
    
    console.log('1. Context:', context);
    console.log('2. Params:', params);
    console.log('3. ID from params:', params?.id);

    // Get and verify auth token
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');
    
    console.log('4. Auth userId:', userId);

    const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      console.log('❌ Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Admin verified:', adminUser.email);

    await dbConnect();

    const customerId = params?.id;
    
    console.log('5. Customer ID:', customerId);
    
    // Check if ID exists
    if (!customerId) {
      console.log('❌ No customer ID in params');
      return NextResponse.json({ 
        error: 'Customer ID is required',
        debug: {
          paramsReceived: params,
          contextKeys: Object.keys(context || {})
        }
      }, { status: 400 });
    }

    // Clean the ID
    const cleanId = customerId.trim();
    console.log('6. Cleaned ID:', cleanId, 'Length:', cleanId.length);

    // Validate ID length
    if (cleanId.length !== 24) {
      console.log('❌ Invalid ID length');
      return NextResponse.json({ 
        error: 'Invalid customer ID format',
        details: `ID must be 24 characters, received ${cleanId.length}`
      }, { status: 400 });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      console.log('❌ Invalid ObjectId format');
      return NextResponse.json({ 
        error: 'Invalid customer ID format',
        details: 'Not a valid MongoDB ObjectId'
      }, { status: 400 });
    }

    console.log('✅ ID validation passed, searching...');

    const customer = await User.findById(cleanId)
      .select('-password -emailVerificationToken -resetPasswordToken')
      .lean();

    if (!customer) {
      console.log('❌ Customer not found');
      return NextResponse.json({ 
        error: 'Customer not found'
      }, { status: 404 });
    }

    console.log('✅ Customer found:', customer.email);

    // Format customer data
    const formattedCustomer = {
      id: customer._id.toString(),
      _id: customer._id.toString(),
      name: `${customer.firstName} ${customer.lastName}`,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || '',
      avatar: customer.avatar || '👤',
      orders: customer.orders || [],
      totalSpent: customer.totalSpent || 0,
      status: getCustomerStatus(customer),
      lastOrder: customer.orders?.[0]?.createdAt || null,
      joinedDate: customer.createdAt,
      location: getLocation(customer),
      loyaltyPoints: customer.loyaltyPoints || 0,
      isActive: customer.isActive !== false,
      lastLogin: customer.lastLogin || null,
      addresses: customer.addresses || [],
      wishlist: customer.wishlist || [],
      cart: customer.cart || [],
      preferences: customer.preferences || {},
      role: customer.role || 'user',
      isVerified: customer.isVerified || false,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };

    return NextResponse.json({ 
      success: true, 
      customer: formattedCustomer 
    });

  } catch (error) {
    console.error('❌ Get customer error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch customer',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// PATCH update customer
export async function PATCH(request, context) {
  try {
    console.log('=== PATCH CUSTOMER ===');
    
    // Await params
    const params = await context.params;
    const customerId = params?.id?.trim();
    
    console.log('Updating customer ID:', customerId);

    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');
    
    const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Validate ID
    if (!customerId || customerId.length !== 24 || !mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ 
        error: 'Invalid customer ID format' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, isActive, role, addresses } = body;

    const customer = await User.findByIdAndUpdate(
      customerId,
      { firstName, lastName, email, phone, isActive, role, addresses },
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    console.log('✅ Customer updated');

    return NextResponse.json({ 
      success: true, 
      message: 'Customer updated successfully',
      customer 
    });

  } catch (error) {
    console.error('❌ Update error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update customer',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE customer
export async function DELETE(request, context) {
  try {
    console.log('=== DELETE CUSTOMER ===');
    
    // Await params
    const params = await context.params;
    const customerId = params?.id?.trim();
    
    console.log('Deleting customer ID:', customerId);

    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer ', '');
    
    const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Validate ID
    if (!customerId || customerId.length !== 24 || !mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ 
        error: 'Invalid customer ID format' 
      }, { status: 400 });
    }

    const customer = await User.findByIdAndDelete(customerId);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    console.log('✅ Customer deleted');

    return NextResponse.json({ 
      success: true, 
      message: 'Customer deleted successfully' 
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete customer',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getCustomerStatus(customer) {
  try {
    if (customer.totalSpent >= 1000) return 'vip';
    if (customer.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) return 'new';
    if (!customer.isActive || (customer.lastLogin && customer.lastLogin < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))) return 'inactive';
    return 'active';
  } catch (error) {
    return 'active';
  }
}

function getLocation(customer) {
  try {
    if (!customer.addresses || !Array.isArray(customer.addresses)) return 'N/A';
    const defaultAddress = customer.addresses.find(addr => addr.isDefault);
    if (defaultAddress && defaultAddress.city && defaultAddress.country) {
      return `${defaultAddress.city}, ${defaultAddress.country}`;
    }
    return 'N/A';
  } catch (error) {
    return 'N/A';
  }
}