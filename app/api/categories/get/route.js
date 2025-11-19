import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';

// GET - Fetch all categories
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const parentId = searchParams.get('parent');
    const featured = searchParams.get('featured') === 'true';
    const tree = searchParams.get('tree') === 'true';
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 0;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    if (!includeInactive) {
      query.isActive = true;
    }

    if (parentId) {
      query.parent = parentId === 'null' ? null : parentId;
    }

    if (featured) {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get category tree structure
    if (tree) {
      const categoryTree = await Category.getCategoryTree();
      return NextResponse.json({
        success: true,
        data: categoryTree,
        total: categoryTree.length
      });
    }

    // Count total documents
    const total = await Category.countDocuments(query);

    // Fetch categories
    let categoriesQuery = Category.find(query)
      .populate('parent', 'name slug')
      .sort('order name');

    if (limit > 0) {
      categoriesQuery = categoriesQuery.limit(limit).skip(skip);
    }

    const categories = await categoriesQuery;

    // Group categories by parent for hierarchical structure
    const rootCategories = categories.filter(cat => !cat.parent);
    const categoriesWithChildren = rootCategories.map(cat => {
      const children = categories.filter(child => 
        child.parent && child.parent._id.toString() === cat._id.toString()
      );
      
      return {
        ...cat.toObject(),
        children: children.map(child => child.toObject())
      };
    });

    return NextResponse.json({
      success: true,
      data: categoriesWithChildren,
      total,
      page,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      hasMore: limit > 0 ? (skip + categories.length) < total : false
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch categories',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { 
      name, 
      slug, 
      description, 
      tagline,
      image, 
      images,
      parent, 
      isActive, 
      isFeatured,
      order,
      metadata 
    } = body;

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category name is required' 
        },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const categorySlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if category with same name or slug exists
    const existingCategory = await Category.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { slug: categorySlug }
      ] 
    });

    if (existingCategory) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category with this name or slug already exists' 
        },
        { status: 409 }
      );
    }

    // Validate parent category if provided
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Parent category not found' 
          },
          { status: 404 }
        );
      }
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),
      slug: categorySlug,
      description: description?.trim() || '',
      tagline: tagline?.trim() || '',
      image: image || '',
      images: images || [],
      parent: parent || null,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      order: order || 0,
      metadata: metadata || {}
    });

    // Populate parent before returning
    await category.populate('parent', 'name slug');

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create category error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed',
          messages 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete multiple categories
export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No category IDs provided' 
        },
        { status: 400 }
      );
    }

    // Check if categories have subcategories
    const categoriesWithChildren = await Category.find({
      parent: { $in: ids }
    });

    if (categoriesWithChildren.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cannot delete categories that have subcategories. Delete subcategories first.' 
        },
        { status: 400 }
      );
    }

    // Delete categories
    const result = await Category.deleteMany({
      _id: { $in: ids }
    });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} category(ies) deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Delete categories error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete categories',
        message: error.message 
      },
      { status: 500 }
    );
  }
}