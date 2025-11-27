import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { name } = await params;
    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock') === 'true';
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query = {
      'anime.name': { $regex: name, $options: 'i' },
      status: 'published',
      isAvailable: true,
    };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Price filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice) && minPrice > 0) query.price.$gte = minPrice;
      if (!isNaN(maxPrice) && maxPrice < Infinity) query.price.$lte = maxPrice;
    }

    // Stock filter
    if (inStock) {
      query.stock = { $gt: 0 };
    }

    // Search filter
    if (search && search.trim()) {
      query.$and = [
        { 'anime.name': { $regex: name, $options: 'i' } },
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ]
        }
      ];
    }

    // Count total products
    const total = await Product.countDocuments(query);

    // Fetch products
    const products = await Product.find(query)
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip(skip)
      .select('-reviews -__v')
      .lean();

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: products,
      anime: {
        name: name,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    console.error('Get products by anime error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products',
        message: error.message 
      },
      { status: 500 }
    );
  }
}