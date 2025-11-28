"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/api/cartApi";
import { getUserId, isAuthenticated } from "@/lib/adminAuth.js";

export default function ProductCard({ product, index }) {
  const cardRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const borderTopRef = useRef(null);
  const borderBottomRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Safe access to rating
  const rating = product?.rating?.average || product?.rating || 0;
  const reviewCount = product?.rating?.count || product?.reviews?.length || 0;

  // Safe access to images
  const primaryImage =
    product?.images?.find((img) => img.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    "/placeholder-product.jpg";

  // Safe access to anime name
  const animeName = product?.anime?.name || "";

  // Calculate discount price
  const price = product?.price || 0;
  const originalPrice = product?.originalPrice || 0;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Stock status check
  const isInStock = () => {
    if (product?.isAvailable === false) return false;
    if (product?.status === "out_of_stock") return false;
    if (product?.stock !== undefined && product?.stock <= 0) return false;
    return true;
  };

  const inStock = isInStock();

  // Format price in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Add to cart handler
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
    if (!inStock || product?.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    setAddingToCart(true);

    try {
      const result = await addToCart(userId, {
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: primaryImage,
        slug: product.slug,
        category: product.category,
        anime: animeName,
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
            fontWeight: "500",
          },
        });

        // Trigger cart update event
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: result.data,
          })
        );

        // Visual feedback animation
        if (buttonRef.current) {
          gsap.to(buttonRef.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          });
        }
      } else {
        toast.error(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Animation when visible
  useEffect(() => {
    if (isVisible && cardRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: (index % 12) * 0.08,
            ease: "expo.out",
          }
        );
      });

      return () => ctx.revert();
    }
  }, [isVisible, index]);

  const handleMouseEnter = () => {
    setIsHovered(true);

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.to(imageRef.current, {
      scale: 1.08,
      duration: 1.2,
    })
      .to(
        cardRef.current,
        {
          y: -12,
          duration: 0.8,
        },
        0
      )
      .to(
        borderTopRef.current,
        {
          scaleX: 1,
          duration: 0.8,
        },
        0
      )
      .to(
        borderBottomRef.current,
        {
          scaleX: 1,
          duration: 0.8,
        },
        0
      )
      .to(
        badgeRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
        },
        0.2
      )
      .to(
        buttonRef.current,
        {
          backgroundColor: "#000000",
          color: "#ffffff",
          duration: 0.6,
        },
        0
      );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.to(imageRef.current, {
      scale: 1,
      duration: 1.2,
    })
      .to(
        cardRef.current,
        {
          y: 0,
          duration: 0.8,
        },
        0
      )
      .to(
        borderTopRef.current,
        {
          scaleX: 0,
          duration: 0.8,
        },
        0
      )
      .to(
        borderBottomRef.current,
        {
          scaleX: 0,
          duration: 0.8,
        },
        0
      )
      .to(
        badgeRef.current,
        {
          y: 10,
          opacity: 0,
          duration: 0.6,
        },
        0
      )
      .to(
        buttonRef.current,
        {
          backgroundColor: "#ffffff",
          color: "#000000",
          duration: 0.6,
        },
        0
      );
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer bg-white"
      style={{ opacity: 0 }}
    >
      {/* Top animated border */}
      <div
        ref={borderTopRef}
        className="h-0.5 bg-black origin-left"
        style={{ transform: "scaleX(0)" }}
      ></div>

      {/* Image Container - Clickable Link */}
      <Link href={`/products/${product?._id}`}>
        <div
          ref={imageContainerRef}
          className="relative h-[500px] overflow-hidden bg-gray-100"
        >
          {isVisible ? (
            <div ref={imageRef} className="w-full h-full">
              <Image
                src={primaryImage}
                alt={product?.name || "Product"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={90}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100 animate-pulse"></div>
          )}

          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-opacity duration-700 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          {/* Status Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
            {product?.isNewArrival && (
              <span className="bg-black text-white px-4 py-2 text-[10px] font-semibold tracking-[0.2em]">
                NEW ARRIVAL
              </span>
            )}
            {product?.isLimitedEdition && (
              <span className="bg-white text-black border border-black px-4 py-2 text-[10px] font-semibold tracking-[0.2em]">
                LIMITED
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-600 text-white px-4 py-2 text-[10px] font-semibold tracking-[0.2em]">
                -{discountPercent}%
              </span>
            )}
            {!inStock && (
              <span className="bg-gray-900 text-white px-4 py-2 text-[10px] font-semibold tracking-[0.2em]">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute top-6 right-6 z-10">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black">
                    {typeof rating === "number" ? rating.toFixed(1) : rating}
                  </span>
                  <svg className="w-4 h-4 fill-black" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Anime Name Badge - Shows on hover */}
          {animeName && (
            <div
              ref={badgeRef}
              className="absolute bottom-6 left-6 right-6 z-10 opacity-0"
              style={{ transform: "translateY(10px)" }}
            >
              <div className="bg-white/95 backdrop-blur-md px-5 py-4 border border-gray-200">
                <p className="text-xs text-gray-600 tracking-widest font-medium">
                  {animeName}
                </p>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div ref={contentRef} className="p-8 bg-white">
        {/* Category/Anime - Clickable */}
        <Link href={`/products/${product?._id}`}>
          {(animeName || product?.category) && (
            <p className="text-[10px] text-gray-500 mb-3 tracking-[0.2em] font-medium uppercase hover:text-black transition-colors">
              {animeName || product?.category}
            </p>
          )}

          {/* Product Name - Clickable */}
          <h3 className="text-xl font-semibold text-black mb-4 tracking-tight leading-tight min-h-[3.5rem] line-clamp-2 hover:text-gray-700 transition-colors">
            {product?.name || "Unnamed Product"}
          </h3>
        </Link>

        {/* Price and Reviews */}
        <div className="flex items-end justify-between mb-6 pb-6 border-b border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 tracking-widest mb-1">
              PRICE
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-black tracking-tight">
                {formatINR(price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatINR(originalPrice)}
                </span>
              )}
            </div>
          </div>
          {reviewCount > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500 tracking-wide">
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          ref={buttonRef}
          disabled={!inStock || addingToCart}
          onClick={handleAddToCart}
          className={`w-full py-5 font-semibold tracking-[0.2em] text-xs transition-all duration-600 border-2 border-black relative ${
            inStock && !addingToCart
              ? "bg-white text-black hover:bg-black hover:text-white"
              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          }`}
        >
          {addingToCart ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              ADDING...
            </span>
          ) : inStock ? (
            "ADD TO CART"
          ) : (
            "OUT OF STOCK"
          )}
        </button>
      </div>

      {/* Bottom animated border */}
      <div
        ref={borderBottomRef}
        className="h-0.5 bg-black origin-right"
        style={{ transform: "scaleX(0)" }}
      ></div>
    </article>
  );
}