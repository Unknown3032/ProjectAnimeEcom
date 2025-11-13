import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || '-createdAt';
    const minStock = searchParams.get('minStock');
    const maxStock = searchParams.get('maxStock');

    const skip = (page - 1) * limit;

    // Build query
    const query = { status: { $ne: 'archived' } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { 'anime.name': { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    // Stock filters
    if (minStock !== null || maxStock !== null) {
      query.stock = {};
      if (minStock !== null) query.stock.$gte = parseInt(minStock);
      if (maxStock !== null) query.stock.$lte = parseInt(maxStock);
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}