import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Use 'id' not 'productId'
    const { id } = await params;
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'recent';

    console.log('Fetching reviews for ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    const product = await Product.findById(id).select('reviews rating').lean();
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    let reviews = [...(product.reviews || [])];

    // Sort reviews
    switch (sortBy) {
      case 'helpful':
        reviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      case 'rating-high':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'recent':
      default:
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        summary: {
          averageRating: product.rating?.average || 0,
          totalReviews: product.rating?.count || 0,
          ratingDistribution: calculateRatingDistribution(reviews)
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(reviews.length / limit),
          totalReviews: reviews.length,
          limit
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    // Use 'id' not 'productId'
    const { id } = await params;
    const body = await request.json();
    const { rating, comment, images = [], userName } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Comment is required'
      }, { status: 400 });
    }

    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Add review
    const newReview = {
      user: new mongoose.Types.ObjectId(),
      userName: userName || 'Anonymous',
      rating,
      comment: comment.trim(),
      images,
      createdAt: new Date()
    };

    product.reviews.push(newReview);

    // Update rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating.average = totalRating / product.reviews.length;
    product.rating.count = product.reviews.length;

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Review added successfully',
      data: {
        review: newReview,
        rating: product.rating
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add review',
      message: error.message
    }, { status: 500 });
  }
}

function calculateRatingDistribution(reviews) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });

  return distribution;
}