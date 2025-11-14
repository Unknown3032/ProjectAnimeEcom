import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/serverAuth';

// GET all customers with filters
export async function GET(request) {
  try {
    console.log('📥 GET /api/admin/customers - Starting request');

    // Get user ID from Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');
    
    const userId = authHeader?.replace('Bearer ', '');
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID provided');
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    // Verify admin token
    console.log('🔐 Verifying admin token...');
    const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      console.log('❌ Admin verification failed');
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    console.log('✅ Admin verified:', adminUser.email);

    // Connect to database
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const segment = searchParams.get('segment') || 'all';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'recent';
    const dateRange = searchParams.get('dateRange') || 'all';

    console.log('📊 Query params:', { page, limit, segment, search, sortBy, dateRange });

    // Build query
    let query = {};

    // Segment filter
    if (segment !== 'all') {
      console.log('🔍 Applying segment filter:', segment);
      switch (segment) {
        case 'active':
          query.isActive = true;
          query.lastLogin = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'new':
          query.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'vip':
          query.totalSpent = { $gte: 1000 };
          break;
        case 'inactive':
          query.$or = [
            { isActive: false },
            { lastLogin: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } }
          ];
          break;
      }
    }

    // Search filter
    if (search) {
      console.log('🔍 Applying search filter:', search);
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (dateRange !== 'all') {
      console.log('🔍 Applying date range filter:', dateRange);
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
        case '90days':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
      }
      
      if (startDate) {
        query.createdAt = { ...query.createdAt, $gte: startDate };
      }
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'recent':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'name-az':
        sort = { firstName: 1, lastName: 1 };
        break;
      case 'name-za':
        sort = { firstName: -1, lastName: -1 };
        break;
      case 'spending-high':
        sort = { totalSpent: -1 };
        break;
      case 'spending-low':
        sort = { totalSpent: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    console.log('📊 Fetching customers with query:', JSON.stringify(query));
    console.log('📊 Sort:', JSON.stringify(sort));

    // Fetch customers - SIMPLIFIED (removed populate for now to avoid errors)
    const [customers, total] = await Promise.all([
      User.find(query)
        .select('-password -emailVerificationToken -resetPasswordToken')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    console.log(`✅ Found ${customers.length} customers out of ${total} total`);

    // Format customer data
    const formattedCustomers = customers.map(customer => {
      try {
        return {
          id: customer._id.toString(),
          name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          email: customer.email || '',
          phone: customer.phone || 'N/A',
          avatar: customer.avatar || '👤',
          orders: Array.isArray(customer.orders) ? customer.orders.length : 0,
          totalSpent: customer.totalSpent || 0,
          status: getCustomerStatus(customer),
          lastOrder: null, // Will be populated later if needed
          joinedDate: customer.createdAt,
          location: getLocation(customer),
          loyaltyPoints: customer.loyaltyPoints || 0,
          isActive: customer.isActive !== false,
          lastLogin: customer.lastLogin || null,
          addresses: customer.addresses || [],
          wishlist: customer.wishlist || [],
          cart: customer.cart || [],
          preferences: customer.preferences || {}
        };
      } catch (err) {
        console.error('❌ Error formatting customer:', err);
        return null;
      }
    }).filter(Boolean); // Remove any null entries

    console.log(`✅ Formatted ${formattedCustomers.length} customers`);

    return NextResponse.json({
      success: true,
      customers: formattedCustomers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get customers error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to fetch customers',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    console.error('Error in getCustomerStatus:', error);
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
    console.error('Error in getLocation:', error);
    return 'N/A';
  }
}