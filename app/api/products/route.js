import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // FIX: Change default limit from 6 to 12
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12; // Changed from 6 to 12
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const anime = searchParams.get('anime');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || '-createdAt';

    // Build query
    const query = {
      status: 'published' // Only show published products
    };

    // Don't filter by isAvailable to show all products
    // Remove this: isAvailable: true

    if (category && category !== 'all' && category !== 'All Products') {
      query.category = category;
    }

    if (anime) {
      query['anime.name'] = new RegExp(anime, 'i');
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'anime.name': new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    // Execute query
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .select('name slug price originalPrice discount images rating stock isNewArrival isBestseller isLimitedEdition anime category brand isAvailable status')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
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