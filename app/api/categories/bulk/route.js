import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Category from '@/models/Category';

// POST - Bulk update categories
export async function POST(request) {
  try {
    await dbConnect();

    const { action, ids, data } = await request.json();

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request. Action and IDs are required' 
        },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'activate':
        result = await Category.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: true } }
        );
        break;

      case 'deactivate':
        result = await Category.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: false } }
        );
        break;

      case 'feature':
        result = await Category.updateMany(
          { _id: { $in: ids } },
          { $set: { isFeatured: true } }
        );
        break;

      case 'unfeature':
        result = await Category.updateMany(
          { _id: { $in: ids } },
          { $set: { isFeatured: false } }
        );
        break;

      case 'delete':
        // Check for subcategories
        const subcategoriesCount = await Category.countDocuments({
          parent: { $in: ids }
        });

        if (subcategoriesCount > 0) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Cannot delete categories with subcategories' 
            },
            { status: 400 }
          );
        }

        result = await Category.deleteMany({ _id: { $in: ids } });
        break;

      case 'update':
        if (!data) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Update data is required' 
            },
            { status: 400 }
          );
        }
        result = await Category.updateMany(
          { _id: { $in: ids } },
          { $set: data }
        );
        break;

      default:
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid action' 
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      affected: result.modifiedCount || result.deletedCount || 0
    });

  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Bulk operation failed',
        message: error.message 
      },
      { status: 500 }
    );
  }
}