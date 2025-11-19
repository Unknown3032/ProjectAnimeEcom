import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';
import mongoose from 'mongoose';

// GET - Fetch single category by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // Add await here

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid category ID format' 
        },
        { status: 400 }
      );
    }

    const category = await Category.findById(id)
      .populate('parent', 'name slug')
      .lean();

    if (!category) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category not found' 
        },
        { status: 404 }
      );
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: id })
      .select('name slug image isActive')
      .lean();

    // Get category path (breadcrumb)
    const path = await Category.getCategoryPath(id);

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        subcategories,
        path
      }
    });

  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // Add await here
    const body = await request.json();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid category ID format' 
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category not found' 
        },
        { status: 404 }
      );
    }

    // Validate name if provided
    if (body.name && (!body.name.trim() || body.name.trim() === '')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category name cannot be empty' 
        },
        { status: 400 }
      );
    }

    // If updating name or slug, check for duplicates
    if (body.name || body.slug) {
      const duplicateQuery = {
        _id: { $ne: id }
      };

      const orConditions = [];

      if (body.name && body.name.trim() !== '') {
        orConditions.push({ 
          name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } 
        });
      }

      if (body.slug && body.slug.trim() !== '') {
        orConditions.push({ slug: body.slug.trim() });
      }

      if (orConditions.length > 0) {
        duplicateQuery.$or = orConditions;
        
        const duplicate = await Category.findOne(duplicateQuery);
        if (duplicate) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Category with this name or slug already exists' 
            },
            { status: 409 }
          );
        }
      }
    }

    // Validate parent category
    if (body.parent !== undefined) {
      // Prevent setting self as parent
      if (body.parent === id) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Category cannot be its own parent' 
          },
          { status: 400 }
        );
      }

      // Check if parent exists (if not null/empty)
      if (body.parent && body.parent !== '' && body.parent !== 'null') {
        const parentCategory = await Category.findById(body.parent);
        if (!parentCategory) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Parent category not found' 
            },
            { status: 404 }
          );
        }

        // Prevent circular reference - check if new parent is a descendant
        const descendants = await existingCategory.getDescendants();
        const descendantIds = descendants.map(d => d._id.toString());
        if (descendantIds.includes(body.parent.toString())) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Cannot set a subcategory as parent (circular reference detected)' 
            },
            { status: 400 }
          );
        }
      }
    }

    // Process images - filter out empty URLs
    if (body.images) {
      body.images = body.images.filter(img => img.url && img.url.trim() !== '');
    }

    // Prepare update data
    const updateData = {
      ...body,
      parent: (body.parent && body.parent !== '' && body.parent !== 'null') ? body.parent : null,
      updatedAt: new Date()
    };

    // Clean up empty strings
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.slug) updateData.slug = updateData.slug.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.tagline) updateData.tagline = updateData.tagline.trim();
    if (updateData.image) updateData.image = updateData.image.trim();

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('parent', 'name slug');

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Update category error:', error);
    
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

    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Category with this name or slug already exists'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (alternative to PUT)
export async function PATCH(request, { params }) {
  return PUT(request, { params });
}

// DELETE - Delete single category
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // Add await here

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid category ID format' 
        },
        { status: 400 }
      );
    }

    // Check if category exists
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

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({ parent: id });
    if (subcategoriesCount > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Cannot delete category with ${subcategoriesCount} subcategory(ies). Delete subcategories first.` 
        },
        { status: 400 }
      );
    }

    // Optional: Check if category has products
    // const productCount = await Product.countDocuments({ category: id });
    // if (productCount > 0) {
    //   return NextResponse.json(
    //     { 
    //       success: false,
    //       error: `Cannot delete category with ${productCount} product(s). Move or delete products first.` 
    //     },
    //     { status: 400 }
    //   );
    // }

    // Delete category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete category',
        message: error.message 
      },
      { status: 500 }
    );
  }
}