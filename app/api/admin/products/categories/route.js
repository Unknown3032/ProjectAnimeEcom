// app/api/admin/products/categories/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Build query
    const query = {
      ...(includeInactive ? {} : { isActive: true })
    };

    // Filter by parent if specified
    if (parentId !== null) {
      if (parentId === 'null' || parentId === '') {
        query.parent = null; // Main categories only
      } else {
        query.parent = parentId; // Specific parent's children
      }
    }

    // Fetch categories
    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .select('name slug description image order parent isFeatured isActive')
      .sort({ order: 1, name: 1 })
      .lean();

    // Get product counts for each category using categoryRef
    const productCounts = await Product.aggregate([
      {
        $match: { status: { $ne: 'archived' } }
      },
      {
        $group: {
          _id: '$categoryRef', // Group by categoryRef (ObjectId)
          count: { $sum: 1 }
        }
      }
    ]);

    // Create count map
    const countMap = {};
    productCounts.forEach(item => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    // Format categories with counts
    const formattedCategories = categories.map(cat => ({
      _id: cat._id,
      value: cat._id.toString(), // Use ObjectId as value for consistency
      label: cat.name,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      parent: cat.parent,
      isFeatured: cat.isFeatured || false,
      isActive: cat.isActive,
      productCount: countMap[cat._id.toString()] || 0,
    }));

    // Separate parent and sub categories
    const parentCategories = formattedCategories.filter(cat => !cat.parent);
    const subCategories = formattedCategories.filter(cat => cat.parent);

    return NextResponse.json({
      success: true,
      categories: parentCategories,
      subCategories: subCategories,
      all: formattedCategories,
      total: formattedCategories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        details: { message: error.message }
      },
      { status: 500 }
    );
  }
}