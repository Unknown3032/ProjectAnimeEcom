import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Anime from '@/models/Anime';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  
  try {
    // Parse request body with error handling
    try {
      const text = await request.text();
      console.log('Raw request body:', text.substring(0, 200) + '...');
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: { message: parseError.message } },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Received product data - Name:', body.name, 'Anime:', body.anime?.name);

    // Connect to database
    try {
      await dbConnect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate required fields
    const missingFields = [];
    if (!body.name?.trim()) missingFields.push('name');
    if (!body.description?.trim()) missingFields.push('description');
    if (!body.price) missingFields.push('price');
    if (!body.sku?.trim()) missingFields.push('sku');
    if (!body.category) missingFields.push('category');
    if (!body.brand?.trim()) missingFields.push('brand');
    if (!body.images || body.images.length === 0) missingFields.push('images');
    if (!body.anime?.name?.trim()) missingFields.push('anime.name');

    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            missingFields,
            validationErrors: missingFields.reduce((acc, field) => {
              acc[field] = `${field} is required`;
              return acc;
            }, {})
          }
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate category exists
    let categoryExists;
    try {
      categoryExists = await Category.findOne({ 
        $or: [{ slug: body.category }, { name: body.category }] 
      });
    } catch (err) {
      console.error('Error finding category:', err);
    }

    if (!categoryExists) {
      console.error('Category not found:', body.category);
      return NextResponse.json(
        { 
          error: 'Invalid category',
          details: {
            validationErrors: {
              category: `Category "${body.category}" does not exist`
            }
          }
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Find or create anime
    let animeDoc;
    try {
      animeDoc = await Anime.findOne({ 
        $or: [
          { slug: body.anime.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') },
          { name: new RegExp(`^${body.anime.name.trim()}$`, 'i') }
        ] 
      });

      if (!animeDoc) {
        const animeSlug = body.anime.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Prepare anime data with default image
        const animeData = {
          name: body.anime.name.trim(),
          slug: animeSlug,
          description: body.anime.description || `Anime series: ${body.anime.name}`,
          // Use first product image or a placeholder
          image: body.images && body.images.length > 0 
            ? (typeof body.images[0] === 'string' ? body.images[0] : body.images[0].url)
            : '/images/anime-placeholder.jpg', // Add a default placeholder
          genre: body.anime.genre || [],
          studio: body.anime.studio || 'Unknown',
          releaseYear: body.anime.releaseYear || new Date().getFullYear(),
          status: body.anime.status || 'Ongoing'
        };

        console.log('Creating anime with data:', animeData);
        animeDoc = await Anime.create(animeData);
        console.log('Created new anime:', animeDoc.name);
      }
    } catch (animeError) {
      console.error('Error with anime:', animeError);
      console.error('Anime error details:', animeError.errors);
      
      // If anime creation fails, return detailed error
      if (animeError.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(animeError.errors).forEach(key => {
          validationErrors[`anime.${key}`] = animeError.errors[key].message;
        });
        
        return NextResponse.json(
          { 
            error: 'Anime validation failed',
            details: { 
              validationErrors,
              message: animeError.message 
            }
          },
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to process anime data',
          details: { message: animeError.message }
        },
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check SKU uniqueness
    try {
      const existingProduct = await Product.findOne({ sku: body.sku });
      if (existingProduct) {
        return NextResponse.json(
          { 
            error: 'Product with this SKU already exists',
            details: {
              validationErrors: {
                sku: `SKU "${body.sku}" is already in use by product: ${existingProduct.name}`
              }
            }
          },
          { 
            status: 409,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    } catch (err) {
      console.error('Error checking SKU:', err);
    }

    // Generate unique slug
    let slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let finalSlug = slug;
    let slugCounter = 1;
    
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${slugCounter}`;
      slugCounter++;
    }

    // Prepare product data
    const productData = {
      name: body.name.trim(),
      slug: finalSlug,
      description: body.description.trim(),
      shortDescription: body.shortDescription?.trim() || body.description.substring(0, 200),
      
      anime: {
        name: animeDoc.name,
        series: body.anime.series?.trim() || '',
        character: body.anime.character?.trim() || '',
        season: body.anime.season?.trim() || '',
        episode: body.anime.episode?.trim() || ''
      },
      
      category: categoryExists.name,
      subCategory: body.subCategory || '',
      tags: body.tags || [],
      
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      discount: body.discount || 0,
      currency: body.currency || 'USD',
      
      stock: parseInt(body.stock) || 0,
      sku: body.sku.trim(),
      variants: body.variants || [],
      
      images: body.images.map((img, index) => ({
        url: img.url || img,
        alt: img.alt || body.name,
        isPrimary: img.isPrimary !== undefined ? img.isPrimary : (index === 0)
      })),
      videos: body.videos || [],
      
      specifications: body.specifications || {},
      
      brand: body.brand.trim(),
      manufacturer: body.manufacturer?.trim() || body.brand.trim(),
      isOfficial: body.isOfficial || false,
      licensedBy: body.licensedBy?.trim() || '',
      
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
        dimensions: body.shipping?.dimensions || {
          length: 0,
          width: 0,
          height: 0
        },
        freeShipping: body.shipping?.freeShipping || false,
        estimatedDelivery: body.shipping?.estimatedDelivery || '5-7 business days'
      },
      
      seo: {
        metaTitle: body.seo?.metaTitle || body.name,
        metaDescription: body.seo?.metaDescription || body.description.substring(0, 160),
        metaKeywords: body.seo?.metaKeywords || [body.name, animeDoc.name, body.category]
      },
      
      relatedProducts: body.relatedProducts || [],
      status: body.status || 'published',
      vendor: body.vendor || null,
      ageRating: body.ageRating || 'All Ages'
    };

    console.log('Creating product with data:', { 
      name: productData.name, 
      slug: productData.slug,
      sku: productData.sku 
    });

    // Create product
    let product;
    try {
      product = await Product.create(productData);
      console.log('Product created successfully:', product._id);
    } catch (createError) {
      console.error('Error creating product:', createError);
      
      if (createError.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(createError.errors).forEach(key => {
          validationErrors[key] = createError.errors[key].message;
        });
        
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: { validationErrors }
          },
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      if (createError.code === 11000) {
        const field = Object.keys(createError.keyPattern)[0];
        return NextResponse.json(
          { 
            error: `Duplicate ${field} detected`,
            details: {
              validationErrors: {
                [field]: `A product with this ${field} already exists`
              }
            }
          },
          { 
            status: 409,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      throw createError;
    }

    // Update anime product count
    try {
      await Anime.findByIdAndUpdate(animeDoc._id, {
        $inc: { productCount: 1 }
      });
    } catch (err) {
      console.error('Error updating anime count:', err);
      // Non-critical, continue
    }

    // Populate and return
    try {
      const populatedProduct = await Product.findById(product._id)
        .populate('relatedProducts', 'name slug price images')
        .lean();

      return NextResponse.json({
        success: true,
        data: populatedProduct,
        message: 'Product created successfully'
      }, { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Error populating product:', err);
      // Return unpopulated product
      return NextResponse.json({
        success: true,
        data: product,
        message: 'Product created successfully'
      }, { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Unexpected error in POST /api/products/add:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}