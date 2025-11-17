import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectDb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Get featured products (you can filter by isFeatured flag or other criteria)
    const products = await Product.find({
      isAvailable: true,
      //   stock: { $gt: 0 }, // Only show products in stock
      isFeatured: true, // If you have this field in your schema
    })
      .select(
        "name slug description shortDescription price originalPrice images category anime badge variants stock tags createdAt"
      )
      .sort({ createdAt: -1 }) // Sort by newest, or use featured order
      .limit(limit)
      .lean();

    // Transform products for frontend
    const transformedProducts = products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.shortDescription || product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0] || "/placeholder.jpg",
      images: product.images || [],
      category: product.category || product.anime?.name || "Anime",
      badge: product.badge || (product.tags?.includes("new") ? "NEW" : null),
      stock: product.stock,
      anime: product.anime?.name || null,
      // Calculate discount percentage
      discount: product.originalPrice
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100
          )
        : 0,
    }));

    return NextResponse.json({
      success: true,
      count: transformedProducts.length,
      data: transformedProducts,
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
