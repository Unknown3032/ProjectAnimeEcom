import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function POST(request, props) {
  try {
    // Next.js 15+ requires awaiting params
    const params = await props.params;
    const id = params.id;
    
    console.log('=== Duplicate Product API ===');
    console.log('Product ID:', id);
    
    await dbConnect();
    
    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid product ID');
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Find the original product
    const originalProduct = await Product.findById(id).lean();

    if (!originalProduct) {
      console.log('❌ Product not found');
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('✅ Original product found:', originalProduct.name);

    // Create a copy of the product
    const productCopy = { ...originalProduct };
    
    // Remove fields that should not be duplicated
    delete productCopy._id;
    delete productCopy.__v;
    delete productCopy.createdAt;
    delete productCopy.updatedAt;
    
    // Reset analytics fields
    productCopy.views = 0;
    productCopy.purchases = 0;
    productCopy.wishlistCount = 0;
    productCopy.rating = {
      average: 0,
      count: 0
    };
    productCopy.reviews = [];
    
    // Modify name and generate unique slug
    const timestamp = Date.now();
    productCopy.name = `${originalProduct.name} (Copy)`;
    
    // Generate unique slug
    let baseSlug = productCopy.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = `${baseSlug}-${timestamp}`;
    let counter = 1;
    
    // Ensure slug is unique
    while (true) {
      const existingProduct = await Product.findOne({ slug });
      if (!existingProduct) break;
      slug = `${baseSlug}-${timestamp}-${counter}`;
      counter++;
    }
    
    productCopy.slug = slug;
    
    // Generate unique SKU
    productCopy.sku = `${originalProduct.sku}-COPY-${timestamp}`;
    
    // Ensure SKU is unique
    let skuCounter = 1;
    let uniqueSKU = productCopy.sku;
    while (true) {
      const existingSKU = await Product.findOne({ sku: uniqueSKU });
      if (!existingSKU) break;
      uniqueSKU = `${originalProduct.sku}-COPY-${timestamp}-${skuCounter}`;
      skuCounter++;
    }
    productCopy.sku = uniqueSKU;
    
    // Set status to draft
    productCopy.status = 'draft';
    productCopy.isAvailable = false;
    
    // Remove featured flags
    productCopy.isFeatured = false;
    productCopy.isNewArrival = false;
    productCopy.isBestseller = false;
    
    // Handle variants - ensure they don't have duplicate SKUs
    if (productCopy.variants && productCopy.variants.length > 0) {
      productCopy.variants = productCopy.variants.map((variant, index) => {
        const variantCopy = { ...variant };
        delete variantCopy._id; // Remove variant _id
        
        // Update variant SKU if it exists
        if (variantCopy.sku) {
          variantCopy.sku = `${variant.sku}-COPY-${timestamp}-V${index}`;
        }
        
        return variantCopy;
      });
    }

    console.log('Creating duplicate product...');
    console.log('New product name:', productCopy.name);
    console.log('New slug:', productCopy.slug);
    console.log('New SKU:', productCopy.sku);

    // Create the new product
    const newProduct = await Product.create(productCopy);

    console.log('✅ Product duplicated successfully:', newProduct._id);

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product duplicated successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error duplicating product:', error);
    console.error('Error details:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => `${e.path}: ${e.message}`);
      console.error('Validation errors:', errors);
      return NextResponse.json(
        { 
          success: false, 
          error: `Validation error: ${errors.join(', ')}`,
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return NextResponse.json(
        { 
          success: false, 
          error: `Duplicate ${field}. Please try again.` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to duplicate product' 
      },
      { status: 500 }
    );
  }
}