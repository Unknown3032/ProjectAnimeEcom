import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';

// Get all categories
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const query = includeInactive ? {} : { isActive: true };

    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort('order name');

    // Group categories by parent
    const rootCategories = categories.filter(cat => !cat.parent);
    const categoriesWithChildren = rootCategories.map(cat => ({
      ...cat.toObject(),
      children: categories.filter(child => 
        child.parent && child.parent._id.toString() === cat._id.toString()
      )
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithChildren,
      total: categories.length
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Add new category
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, description, image, parent } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if category exists
    const existingCategory = await Category.findOne({ 
      $or: [{ name }, { slug }] 
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      parent: parent || null,
      order: body.order || 0
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Add category error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}