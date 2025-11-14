import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/serverAuth';

export async function GET(request) {
  try {
   const authHeader = request.headers.get('authorization');
const userId = authHeader?.replace('Bearer ', '');
const adminUser = await verifyAdminToken(userId);
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const customers = await User.find()
      .select('-password -emailVerificationToken -resetPasswordToken')
      .populate('orders')
      .lean();

    if (format === 'csv') {
      // Create CSV
      const csvHeaders = [
        'ID', 'First Name', 'Last Name', 'Email', 'Phone',
        'Total Orders', 'Total Spent', 'Loyalty Points', 'Status',
        'Join Date', 'Last Login'
      ].join(',');

      const csvRows = customers.map(customer => [
        customer._id,
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone || '',
        customer.orders?.length || 0,
        customer.totalSpent || 0,
        customer.loyaltyPoints || 0,
        customer.isActive ? 'Active' : 'Inactive',
        new Date(customer.createdAt).toLocaleDateString(),
        customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'Never'
      ].join(','));

      const csv = [csvHeaders, ...csvRows].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="customers-${Date.now()}.csv"`
        }
      });
    } else {
      // Return JSON
      return NextResponse.json({
        success: true,
        customers
      });
    }

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export customers' },
      { status: 500 }
    );
  }
}