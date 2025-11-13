import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Anime from '@/models/Anime';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    const {
      name,
      description,
      price,
      stock,
      sku,
      category,
      brand,
      images,
      anime
    } = body;

    if (!name || !description || !price || !sku || !category || !brand || !images || !anime) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Validate category exists
    const categoryExists = await Category.findOne({ 
      $or: [{ slug: category }, { name: category }] 
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate or create anime
    let animeDoc = await Anime.findOne({ 
      $or: [{ slug: anime.name }, { name: anime.name }] 
    });

    if (!animeDoc) {
      const animeSlug = anime.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      animeDoc = await Anime.create({
        name: anime.name,
        slug: animeSlug,
        description: anime.description || '',
        image: anime.image || '',
        genre: anime.genre || [],
        studio: anime.studio || '',
        releaseYear: anime.releaseYear,
        status: anime.status || 'Ongoing'
      });
    }

    // Check if SKU already exists (excluding current product if editing)
    const skuQuery = { sku };
    if (body._id) {
      skuQuery._id = { $ne: body._id };
    }
    
    const existingProduct = await Product.findOne(skuQuery);
    if (existingProduct) {
      return NextResponse.json(
        { 
          error: 'Product with this SKU already exists',
          details: {
            validationErrors: {
              sku: `SKU "${sku}" is already in use by product: ${existingProduct.name}`
            }
          }
        },
        { status: 409 }
      );
    }

    // Generate unique slug
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let finalSlug = slug;
    let slugCounter = 1;
    
    // Check for slug uniqueness (excluding current product if editing)
    let slugQuery = { slug: finalSlug };
    if (body._id) {
      slugQuery._id = { $ne: body._id };
    }
    
    while (await Product.findOne(slugQuery)) {
      finalSlug = `${slug}-${slugCounter}`;
      slugCounter++;
      slugQuery.slug = finalSlug;
    }

    // Prepare product data
    const productData = {
      name,
      slug: finalSlug,
      description,
      shortDescription: body.shortDescription || description.substring(0, 200),
      
      anime: {
        name: animeDoc.name,
        series: anime.series || '',
        character: anime.character || '',
        season: anime.season || '',
        episode: anime.episode || ''
      },
      
      category: categoryExists.name,
      subCategory: body.subCategory || '',
      tags: body.tags || [],
      
      price: parseFloat(price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      discount: body.discount || 0,
      currency: body.currency || 'USD',
      
      stock: parseInt(stock),
      sku,
      variants: body.variants || [],
      
      images: images.map((img, index) => ({
        url: img.url || img,
        alt: img.alt || name,
        isPrimary: index === 0
      })),
      videos: body.videos || [],
      
      specifications: body.specifications || {},
      
      brand,
      manufacturer: body.manufacturer || brand,
      isOfficial: body.isOfficial || false,
      licensedBy: body.licensedBy || '',
      
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
      isFeatured: body.isFeatured || false,
      isNewArrival: body.isNewArrival || false,
      isBestseller: body.isBestseller || false,
      isPreOrder: body.isPreOrder || false,
      preOrderReleaseDate: body.preOrderReleaseDate || null,
      
      isLimitedEdition: body.isLimitedEdition || false,
      limitedQuantity: body.limitedQuantity || null,
      
      shipping: {
        weight: body.shipping?.weight || 0.5,
        dimensions: body.shipping?.dimensions || {},
        freeShipping: body.shipping?.freeShipping || false,
        estimatedDelivery: body.shipping?.estimatedDelivery || '5-7 business days'
      },
      
      seo: {
        metaTitle: body.seo?.metaTitle || name,
        metaDescription: body.seo?.metaDescription || description.substring(0, 160),
        metaKeywords: body.seo?.metaKeywords || [name, animeDoc.name, category]
      },
      
      relatedProducts: body.relatedProducts || [],
      status: body.status || 'published',
      vendor: body.vendor || null,
      ageRating: body.ageRating || 'All Ages'
    };

    // Create product
    const product = await Product.create(productData);

    // Update anime product count
    await Anime.findByIdAndUpdate(animeDoc._id, {
      $inc: { productCount: 1 }
    });

    // Populate related data
    const populatedProduct = await Product.findById(product._id)
      .populate('relatedProducts', 'name slug price images');

    return NextResponse.json({
      success: true,
      data: populatedProduct,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Add product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: {
            validationErrors: Object.fromEntries(
              Object.entries(error.errors).map(([key, err]) => [key, err.message])
            )
          }
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { 
          error: `Duplicate ${field} detected`,
          details: {
            validationErrors: {
              [field]: `A product with this ${field} already exists`
            }
          }
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}