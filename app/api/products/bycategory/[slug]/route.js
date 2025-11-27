import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    // Map category slugs to category enum values
    const categoryMap = {
      'clothing': 'Clothing',
      'accessories': 'Accessories',
      'figures': 'Figures',
      'plushies': 'Plushies',
      'posters': 'Posters',
      'home-decor': 'Home Decor',
      'stationery': 'Stationery',
      'electronics': 'Electronics',
      'collectibles': 'Collectibles',
      'manga': 'Manga',
      'art-books': 'Art Books',
      'cosplay': 'Cosplay',
      'keychains': 'Keychains',
      'bags': 'Bags',
      'jewelry': 'Jewelry',
      'other': 'Other',
    };

    const categoryName = categoryMap[slug.toLowerCase()];

    if (!categoryName) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category not found' 
        },
        { status: 404 }
      );
    }

    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const inStock = searchParams.get('inStock') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query = {
      category: categoryName,
      status: 'published',
      isAvailable: true,
    };

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

    // Featured filter
    if (featured) {
      query.isFeatured = true;
    }

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'anime.name': { $regex: search, $options: 'i' } },
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

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: products,
      category: {
        name: categoryName,
        slug: slug,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        sortBy,
        order: order === 1 ? 'asc' : 'desc',
        minPrice: minPrice || 0,
        maxPrice: maxPrice || Infinity,
        inStock,
        featured,
        search,
      },
    });

  } catch (error) {
    console.error('Get products by category slug error:', error);
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