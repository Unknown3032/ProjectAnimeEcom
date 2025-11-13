import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request, props) {
  try {
    // Next.js 15+ requires awaiting params
    const params = await props.params;
    const id = params.id;
    
   
    
    await dbConnect();
    
    // Validate ID format
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
     
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

   
    const product = await Product.findById(id).lean();
    
    if (!product) {
    
      
      // Debug: Check if any products exist
      const totalProducts = await Product.countDocuments();
  
      
      // Debug: Try to find first product
      const firstProduct = await Product.findOne().lean();
      if (firstProduct) {
      }
      
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    
    return NextResponse.json({ 
      success: true, 
      product 
    });
  } catch (error) {
    console.error('❌ Error in GET /api/admin/products/[id]:', error);
    console.error('Error stack:', error.stack);
    
    // Handle MongoDB CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, props) {
  try {
    // Next.js 15+ requires awaiting params
    const params = await props.params;
    const id = params.id;
    
    
    await dbConnect();
    
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('❌ Error in PATCH:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, props) {
  try {
    // Next.js 15+ requires awaiting params
    const params = await props.params;
    const id = params.id;
    
    
    await dbConnect();
    
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}