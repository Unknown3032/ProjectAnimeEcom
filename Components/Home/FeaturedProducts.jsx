"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedProducts } from "@/lib/api/productsApi";
import { addToCart } from "@/lib/api/cartApi";
import { getUserId, isAuthenticated } from "@/lib/adminAuth.js";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const cardsRef = useRef([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState(null);

  // Format price in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to get image URL with comprehensive error handling
  const getImageUrl = (imagePath) => {
    try {
      // Check if imagePath exists and is a string
      // if (!imagePath || typeof imagePath !== 'string') {
      //   // console.warn('Invalid image path:', imagePath);
      //   return '/placeholder-image.jpg';
      // }

      // Trim whitespace
      const trimmedPath = imagePath.url;

      // (trimmedPath);

      // If empty after trim
      if (!trimmedPath) {
        return "/placeholder-image.jpg";
      }

      // If it's already a full URL, return it
      if (
        trimmedPath.startsWith("http://") ||
        trimmedPath.startsWith("https://")
      ) {
        return trimmedPath;
      }

      // Get backend URL from env
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // If it starts with /uploads, prepend backend URL
      if (trimmedPath.startsWith("/uploads")) {
        return `${backendUrl}${trimmedPath}`;
      }

      // If it's a relative path without /uploads
      if (trimmedPath.startsWith("uploads/")) {
        return `${backendUrl}/${trimmedPath}`;
      }

      // If it starts with /, assume it's an absolute path on backend
      if (trimmedPath.startsWith("/")) {
        return `${backendUrl}${trimmedPath}`;
      }

      // Default: treat as relative path
      return `${backendUrl}/${trimmedPath}`;
    } catch (error) {
      console.error("Error processing image path:", error);
      return "/placeholder-image.jpg";
    }
  };

  // Helper function to truncate title
  const truncateTitle = (title, maxWords = 6) => {
    if (!title || typeof title !== "string") return "Untitled Product";
    const words = title.split(" ");
    if (words.length <= maxWords) return title;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getFeaturedProducts(10);

      if (result.success) {
        result.data;
        setProducts(result.data);
      } else {
        setError(result.message);
        toast.error(result.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length === 0 || loading) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Cards animation
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [products, loading]);

  const smoothScrollTo = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    gsap.to(container, {
      scrollLeft: targetScroll,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const handleAddToCart = async (product) => {
    // Check authentication
    if (!isAuthenticated()) {
      toast.error("Please login to add items to cart", {
        duration: 3000,
        icon: "🔒",
      });
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error("Unable to get user information");
      return;
    }

    // Check stock
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [product.id]: true }));

    try {
      const result = await addToCart(userId, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image.url,
      });

      if (result.success) {
        toast.success(`${product.name} added to cart!`, {
          duration: 3000,
          position: "top-center",
          icon: "🛒",
          style: {
            background: "#000",
            color: "#fff",
            padding: "16px",
            fontSize: "14px",
          },
        });

        // Trigger cart update event
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: result.data,
          })
        );
      } else {
        toast.error(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const ProductCard = ({ product, index }) => {
    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const buttonRef = useRef(null);
    const [imageError, setImageError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const isLoading = loadingStates[product?.id];
    const isOutOfStock = (product?.stock || 0) <= 0;

    // Get the image URL safely
    const imageUrl = getImageUrl(product?.image);

    // Calculate discount percentage
    const hasDiscount = product?.originalPrice && product?.originalPrice > product?.price;
    const discountPercent = hasDiscount
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    const handleMouseEnter = () => {
      if (isOutOfStock) return;

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.04,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -3,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleButtonClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock) return;

      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }

      await handleAddToCart(product);
    };

    const handleImageError = () => {
      console.warn(`Failed to load image for product: ${product?.name}`, {
        productId: product?.id,
        attemptedUrl: imageUrl,
        originalPath: product?.image,
      });
      setImageError(true);
      setImgLoaded(true);
    };

    const handleImageLoad = () => {
      setImgLoaded(true);
      setImageError(false);
    };

    return (
      <Link
        href={`/products/${product?.id}`}
        ref={(el) => {
          cardRef.current = el;
          cardsRef.current[index] = el;
        }}
        className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px] cursor-pointer block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image */}
        <div className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden bg-gray-100 mb-5">
          <div ref={imageRef} className="w-full h-full relative">
            {!imgLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            )}

            {imageError ? (
              // Fallback placeholder when image fails
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <svg
                  className="w-20 h-20 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500 text-sm font-medium">
                  Image Not Available
                </p>
                <p className="text-gray-400 text-xs mt-1">{product?.name}</p>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt={product?.name || "Product image"}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
                onError={handleImageError}
                onLoad={handleImageLoad}
                priority={index < 3}
                unoptimized={imageUrl?.includes("localhost")}
              />
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="bg-white text-black px-4 py-2 text-sm font-medium tracking-wider uppercase">
                Out of Stock
              </span>
            </div>
          )}

          {/* Badge */}
          {product?.badge && !isOutOfStock && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black text-white text-xs font-medium tracking-wider uppercase z-10">
              {product.badge}
            </div>
          )}

          {/* Discount - Updated to show calculated percentage */}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white text-xs font-bold z-10">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Content - Fixed Height Container */}
        <div className="px-1 flex flex-col" style={{ minHeight: "220px" }}>
          {/* Category */}
          <span className="block text-xs tracking-[0.25em] uppercase mb-3 text-black/35 font-medium">
            {product?.category || "Uncategorized"}
          </span>

          {/* Anime Name (if available) */}
          {product?.anime && (
            <span className="block text-xs text-black/50 mb-2 truncate">
              {product.anime}
            </span>
          )}

          {/* Name - Fixed Height */}
          <h3 className="text-lg sm:text-xl font-light mb-4 leading-tight h-[3.5rem] overflow-hidden">
            {truncateTitle(product?.name, 6)}
          </h3>

          {/* Price - Updated to INR */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl sm:text-3xl font-light">
              {formatINR(product?.price || 0)}
            </span>
            {product?.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-black/40 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button - Pushed to bottom */}
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            disabled={isLoading || isOutOfStock}
            className="w-full py-3 cursor-pointer bg-black text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-black/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-auto"
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </span>
            ) : (
              <>
                <span className="relative z-10">Add to Cart</span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      </Link>
    );
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px]">
      <div className="h-[400px] sm:h-[450px] md:h-[500px] bg-gray-200 animate-pulse mb-5 rounded" />
      <div className="px-1">
        <div className="h-3 bg-gray-200 animate-pulse w-20 mb-3 rounded" />
        <div className="h-6 bg-gray-200 animate-pulse w-full mb-2 rounded" />
        <div className="h-6 bg-gray-200 animate-pulse w-3/4 mb-4 rounded" />
        <div className="h-8 bg-gray-200 animate-pulse w-24 mb-4 rounded" />
        <div className="h-12 bg-gray-200 animate-pulse w-full rounded" />
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-10 md:py-15 lg:py-20 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <span className="block text-xs tracking-[0.35em] uppercase mb-4 text-black/35">
              Curated Selection
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight">
              Featured
            </h2>
          </div>

          {/* Navigation - Desktop */}
          {!loading && products.length > 0 && (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => smoothScrollTo("left")}
                className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                aria-label="Previous"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => smoothScrollTo("right")}
                className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                aria-label="Next"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Scroll */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pb-4"
          >
            <div className="flex gap-6 md:gap-8">
              {loading ? (
                // Show loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              ) : error ? (
                // Show error state
                <div className="w-full text-center py-20">
                  <p className="text-red-500 text-lg mb-4">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : products.length > 0 ? (
                // Show products
                products.map((product, index) => (
                  <ProductCard
                    key={product?.id || index}
                    product={product}
                    index={index}
                  />
                ))
              ) : (
                // No products found
                <div className="w-full text-center py-20">
                  <p className="text-gray-500 text-lg">
                    No featured products available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {!loading && products.length > 0 && (
          <div className="md:hidden flex justify-center gap-3 mt-8">
            <button
              onClick={() => smoothScrollTo("left")}
              className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
              aria-label="Previous"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => smoothScrollTo("right")}
              className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
              aria-label="Next"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}