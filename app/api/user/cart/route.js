import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Cart from '@/models/Cart';

// GET - Fetch user's cart
export async function GET(request) {
  try {
    await dbConnect();

    // Get userId from query params or headers
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ userId, items: [] });
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, productId, name, price, quantity = 1, image } = body;
    

    // Validation
    if (!userId || !productId || !name || !price) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{ productId, name, price, quantity, image }],
      });
    } else {
      // Check if item already exists
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ productId, name, price, quantity, image:image});
      }
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Clear cart
export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0, totalItems: 0 }
    );

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}