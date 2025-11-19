import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import dbConnect from '@/lib/connectDb';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Await params in Next.js 15
    const { id } = await params;

    console.log('Fetching product with ID:', id);

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    // Find product by _id
    const product = await Product.findById(id)
      .populate('relatedProducts', 'name slug price originalPrice discount images rating category anime')
      .lean();

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Calculate additional fields
    const enrichedProduct = {
      ...product,
      discountPercentage: product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : product.discount || 0,
      finalPrice: product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price,
      inStock: product.stock > 0,
      stockStatus: product.stock === 0 
        ? 'Out of Stock' 
        : product.stock < 10 
          ? 'Low Stock' 
          : 'In Stock',
      savings: product.originalPrice && product.originalPrice > product.price
        ? product.originalPrice - product.price
        : 0
    };

    // Increment views (don't wait for it)
    Product.findByIdAndUpdate(id, {
      $inc: { views: 1 }
    }).catch(err => console.error('Error incrementing views:', err));

    console.log('Product fetched successfully:', enrichedProduct.name);

    return NextResponse.json({
      success: true,
      data: enrichedProduct
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // Await params
    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    }, { status: 500 });
  }
}