// app/api/admin/products/categories/[id]/subcategories/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Verify parent category exists
    const parentCategory = await Category.findById(id);

    if (!parentCategory) {
      return NextResponse.json({
        success: false,
        error: 'Parent category not found'
      }, { status: 404 });
    }

    // Fetch subcategories
    const subcategories = await Category.find({ 
      parent: id,
      isActive: true 
    })
    .select('name slug description image order isFeatured')
    .sort({ order: 1, name: 1 })
    .lean();

    // Get product counts
    const productCounts = await Product.aggregate([
      {
        $match: { 
          subCategoryRef: { $in: subcategories.map(s => s._id) },
          status: { $ne: 'archived' }
        }
      },
      {
        $group: {
          _id: '$subCategoryRef',
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    productCounts.forEach(item => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    // Format subcategories
    const formattedSubcategories = subcategories.map(subCat => ({
      _id: subCat._id,
      value: subCat._id.toString(),
      label: subCat.name,
      name: subCat.name,
      slug: subCat.slug,
      description: subCat.description || '',
      image: subCat.image || '',
      isFeatured: subCat.isFeatured || false,
      productCount: countMap[subCat._id.toString()] || 0,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSubcategories,
      count: formattedSubcategories.length,
      parent: {
        _id: parentCategory._id,
        name: parentCategory.name,
        slug: parentCategory.slug
      }
    });

  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subcategories',
      details: { message: error.message }
    }, { status: 500 });
  }
}