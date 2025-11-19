import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';
import mongoose from 'mongoose';

// PATCH - Toggle category active status
export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // Add await here
    const { field } = await request.json(); // 'isActive' or 'isFeatured'

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid category ID' 
        },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category not found' 
        },
        { status: 404 }
      );
    }

    const validFields = ['isActive', 'isFeatured'];
    if (!validFields.includes(field)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid field. Use isActive or isFeatured' 
        },
        { status: 400 }
      );
    }

    category[field] = !category[field];
    await category.save();

    return NextResponse.json({
      success: true,
      data: category,
      message: `Category ${field} toggled successfully`
    });

  } catch (error) {
    console.error('Toggle category error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to toggle category status',
        message: error.message 
      },
      { status: 500 }
    );
  }
}