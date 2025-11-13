import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import dbConnect from '@/lib/connectDb';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { quantity, operation } = await request.json();

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await product.updateStock(quantity, operation);

    return NextResponse.json({
      success: true,
      product,
      message: `Stock ${operation === 'increase' ? 'added' : 'removed'} successfully`,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}