import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Use 'id' not 'productId'
    const { id } = await params;
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 6;

    console.log('Fetching related products for ID:', id);

    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    // Get the current product
    const product = await Product.findById(id).lean();
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Find related products
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      $or: [
        { category: product.category },
        { 'anime.name': product.anime?.name },
        { tags: { $in: product.tags || [] } }
      ],
      isAvailable: true,
      status: 'published',
      stock: { $gt: 0 }
    })
    .select({
      name: 1,
      slug: 1,
      price: 1,
      originalPrice: 1,
      discount: 1,
      images: 1,
      rating: 1,
      category: 1,
      anime: 1,
      brand: 1,
      isNewArrival: 1,
      isBestseller: 1,
      isLimitedEdition: 1
    })
    .limit(limit)
    .sort('-rating.average')
    .lean();

    // Enrich related products
    const enrichedRelatedProducts = relatedProducts.map(p => ({
      ...p,
      discountPercentage: p.originalPrice && p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : p.discount || 0,
      finalPrice: p.discount > 0
        ? p.price - (p.price * p.discount / 100)
        : p.price
    }));

    console.log(`Found ${enrichedRelatedProducts.length} related products`);

    return NextResponse.json({
      success: true,
      data: {
        products: enrichedRelatedProducts,
        count: enrichedRelatedProducts.length
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch related products',
      message: error.message
    }, { status: 500 });
  }
}