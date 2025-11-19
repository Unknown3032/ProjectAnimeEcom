import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import dbConnect from '@/lib/connectDb';

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const limit = parseInt(searchParams.get('limit')) || 12;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;
    const sortBy = searchParams.get('sortBy') || 'trending';

    // Build sort criteria based on sortBy parameter
    let sortCriteria;
    
    switch (sortBy) {
      case 'trending':
        // Trending: combination of recent purchases, views, and wishlist
        sortCriteria = {
          trendingScore: -1,
          'rating.average': -1,
          createdAt: -1
        };
        break;
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'popular':
        sortCriteria = { purchases: -1, views: -1 };
        break;
      case 'rating':
        sortCriteria = { 'rating.average': -1, 'rating.count': -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    // Calculate trending score using aggregation
    const products = await Product.aggregate([
      {
        $match: {
          isAvailable: true,
          status: 'published',
          stock: { $gt: 0 }
        }
      },
      {
        $addFields: {
          // Trending score calculation
          // Formula: (purchases * 3) + (views * 0.1) + (wishlistCount * 2) + (rating.average * 10)
          trendingScore: {
            $add: [
              { $multiply: [{ $ifNull: ['$purchases', 0] }, 3] },
              { $multiply: [{ $ifNull: ['$views', 0] }, 0.1] },
              { $multiply: [{ $ifNull: ['$wishlistCount', 0] }, 2] },
              { $multiply: [{ $ifNull: ['$rating.average', 0] }, 10] }
            ]
          },
          // Calculate discount percentage
          discountPercentage: {
            $cond: {
              if: { 
                $and: [
                  { $gt: ['$originalPrice', 0] },
                  { $gt: ['$originalPrice', '$price'] }
                ]
              },
              then: {
                $round: [
                  {
                    $multiply: [
                      { 
                        $divide: [
                          { $subtract: ['$originalPrice', '$price'] }, 
                          '$originalPrice'
                        ] 
                      },
                      100
                    ]
                  },
                  0
                ]
              },
              else: { $ifNull: ['$discount', 0] }
            }
          },
          // Calculate final price
          finalPrice: {
            $cond: {
              if: { $gt: [{ $ifNull: ['$discount', 0] }, 0] },
              then: { 
                $subtract: [
                  '$price', 
                  { 
                    $multiply: [
                      '$price', 
                      { $divide: [{ $ifNull: ['$discount', 0] }, 100] }
                    ] 
                  }
                ] 
              },
              else: '$price'
            }
          }
        }
      },
      {
        $sort: sortCriteria
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          shortDescription: 1,
          anime: 1,
          category: 1,
          subCategory: 1,
          tags: 1,
          price: 1,
          originalPrice: 1,
          discount: 1,
          discountPercentage: 1,
          finalPrice: 1,
          currency: 1,
          stock: 1,
          sku: 1,
          images: 1,
          brand: 1,
          isOfficial: 1,
          rating: 1,
          isAvailable: 1,
          isFeatured: 1,
          isNewArrival: 1,
          isBestseller: 1,
          isLimitedEdition: 1,
          isPreOrder: 1,
          views: 1,
          purchases: 1,
          wishlistCount: 1,
          trendingScore: 1,
          createdAt: 1,
          updatedAt: 1,
          variants: {
            $cond: {
              if: { $isArray: '$variants' },
              then: {
                $map: {
                  input: { $slice: ['$variants', 3] }, // Only first 3 variants
                  as: 'variant',
                  in: {
                    size: '$$variant.size',
                    color: '$$variant.color',
                    colorHex: '$$variant.colorHex',
                    stock: '$$variant.stock',
                    price: '$$variant.price'
                  }
                }
              },
              else: []
            }
          }
        }
      }
    ]);

    // Get total count for pagination
    const totalCount = await Product.countDocuments({
      isAvailable: true,
      status: 'published',
      stock: { $gt: 0 }
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trending products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trending products',
      message: error.message
    }, { status: 500 });
  }
}