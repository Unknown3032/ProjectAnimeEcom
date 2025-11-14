import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Order from '@/models/Order';
import Product from '@/models/Product';
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
    const limit = parseInt(searchParams.get('limit')) || 5;
    const period = searchParams.get('period') || '30d';

    const now = new Date();
    let days = 30;
    
    switch(period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
    }
    
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Aggregate top products from orders
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit }
    ]);

    // Get product details
    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await Product.findById(item._id);
        
        if (!product) {
          return null;
        }

        // Get primary image
        const primaryImage = product.images?.find(img => img.isPrimary);
        const imageUrl = primaryImage?.url || product.images?.[0]?.url || '/placeholder-product.jpg';

        return {
          id: item._id.toString(),
          name: product.name || 'Unknown Product',
          image: imageUrl,
          sales: item.sales,
          revenue: `$${item.revenue.toFixed(2)}`,
          rawRevenue: item.revenue,
          category: product.category || 'Uncategorized',
          stock: product.stock || 0,
          anime: product.anime?.name || 'N/A'
        };
      })
    );

    // Filter out null values
    const validProducts = productsWithDetails.filter(p => p !== null);

    return NextResponse.json({ products: validProducts });
  } catch (error) {
    console.error('Top Products API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}