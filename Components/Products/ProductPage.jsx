"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProduct, useFeaturedProducts } from "@/lib/hooks/useProduct";
import { useCart } from "@/contexts/CartContext";
import { incrementProductViews } from "@/lib/api/productsApi";
import authService from "@/services/authService";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/api/cartApi";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const { product, loading, error } = useProduct(productId);
  const { products: featuredProducts, loading: featuredLoading } =
    useFeaturedProducts(4);
  const { getCartCount } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [viewTracked, setViewTracked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const heroRef = useRef(null);
  const galleryRef = useRef(null);
  const detailsRef = useRef(null);
  const tabsRef = useRef(null);
  const featuredRef = useRef(null);

  // ===== HELPER FUNCTIONS =====

  // Format price in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Get user ID
  const getUserId = () => {
    const user = authService.getCurrentUser();
    return user?._id;
  };

  // Get rating value from various formats
  const getRating = (ratingData) => {
    if (!ratingData) return 0;
    if (typeof ratingData === "number") return ratingData;
    if (typeof ratingData === "object" && ratingData.average !== undefined) {
      return ratingData.average;
    }
    return 0;
  };

  // Get review count from various formats
  const getReviewCount = (product) => {
    if (!product) return 0;
    if (
      product.rating &&
      typeof product.rating === "object" &&
      product.rating.count !== undefined
    ) {
      return product.rating.count;
    }
    if (product.reviews) return product.reviews;
    if (product.reviewCount) return product.reviewCount;
    return 0;
  };

  // Get product images
  const getProductImages = () => {
    if (!product) return [];

    if (product.images && product.images.length > 0) {
      return product.images.map((img) => {
        if (typeof img === "string") return img;
        return img.url || img;
      });
    }

    if (product.mainImage) return [product.mainImage];
    if (product.image) return [product.image];

    return ["/images/placeholder-product.jpg"];
  };

  // Calculate discount percentage
  const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  // Format dimensions safely
  const formatDimensions = (dimensions) => {
    if (!dimensions || typeof dimensions !== 'object') return null;
    
    const { length, width, height, unit } = dimensions;
    
    if (!length && !width && !height) return null;
    
    return `${length || 0} × ${width || 0} × ${height || 0} ${unit || 'cm'}`;
  };

  // Format specifications value safely
  const formatSpecValue = (value) => {
    // Handle null or undefined
    if (value === null || value === undefined) return 'N/A';
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    // Handle objects (like dimensions)
    if (typeof value === 'object') {
      // Check if it's a dimensions object
      if (value.length !== undefined || value.width !== undefined || value.height !== undefined) {
        const formatted = formatDimensions(value);
        return formatted || 'N/A';
      }
      // For other objects, try to stringify
      try {
        return JSON.stringify(value);
      } catch {
        return 'N/A';
      }
    }
    
    // Handle primitives (string, number, boolean)
    return String(value);
  };

  // ===== END HELPER FUNCTIONS =====

  // Track product view
  useEffect(() => {
    if (product && !viewTracked) {
      incrementProductViews(product._id);
      setViewTracked(true);
    }
  }, [product, viewTracked]);

  useEffect(() => {
    if (!product) return;

    // Hero animation
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .fromTo(
        ".product-breadcrumb",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
      .fromTo(
        ".product-gallery",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".product-info > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.6"
      );

    // Tabs animation
    gsap.fromTo(
      ".product-tabs",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: tabsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Featured products animation
    gsap.fromTo(
      ".featured-title",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".featured-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".featured-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [product]);

  // Image change animation
  const handleImageChange = (index) => {
    gsap.to(".main-product-image", {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      onComplete: () => {
        setSelectedImage(index);
        gsap.to(".main-product-image", {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.2)",
        });
      },
    });
  };

  const handleAddToCart = async () => {
    // Check authentication
    if (!isAuthenticated()) {
      toast.error("Please login to add items to cart", {
        duration: 3000,
        icon: "🔒",
        style: {
          background: "#000",
          color: "#fff",
          padding: "16px",
          fontSize: "14px",
        },
      });
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error("Unable to get user information", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
      return;
    }

    // Check stock
    if (!product.inStock || product.stock <= 0) {
      toast.error("Product is out of stock", {
        duration: 3000,
        icon: "❌",
        style: {
          background: "#000",
          color: "#fff",
          padding: "16px",
        },
      });
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`, {
        duration: 3000,
        style: {
          background: "#000",
          color: "#fff",
        },
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await addToCart(userId, {
        productId: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        quantity: quantity,
        image: product?.images[0]?.url,
      });

      if (result && result.success) {
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

        // Reset quantity after successful add
        setQuantity(1);

        // Trigger cart update event
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: result.data,
          })
        );
      } else {
        toast.error(result?.message || "Failed to add item to cart", {
          style: {
            background: "#000",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong. Please try again.", {
        style: {
          background: "#000",
          color: "#fff",
        },
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated()) {
      toast.error("Please login to add items to wishlist", {
        duration: 3000,
        icon: "🔒",
        style: {
          background: "#000",
          color: "#fff",
        },
      });
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
      return;
    }

    toast("Wishlist feature coming soon!", {
      icon: "❤️",
      style: {
        background: "#000",
        color: "#fff",
      },
    });
  };

  const productImages = getProductImages();
  const discountPercent = calculateDiscount(product?.price, product?.salePrice);

  // Loading State
  if (loading) {
    return (
      <div
        style={{
          background: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(0,0,0,0.1)",
              borderTop: "3px solid black",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "rgba(0,0,0,0.6)" }}>Loading product...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div
        style={{
          background: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "500px", padding: "2rem" }}
        >
          <svg
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1rem",
              color: "rgba(0,0,0,0.3)",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              fontWeight: 400,
            }}
          >
            Product Not Found
          </h2>
          <p style={{ color: "rgba(0,0,0,0.6)", marginBottom: "2rem" }}>
            {error ||
              "The product you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => router.push("/products")}
            style={{
              padding: "0.875rem 2rem",
              background: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        className="product-breadcrumb"
        style={{
          background: "#fafafa",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          padding: "1.5rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 3rem)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.875rem",
              color: "rgba(0,0,0,0.6)",
            }}
          >
            <Link
              href="/"
              style={{
                color: "rgba(0,0,0,0.6)",
                textDecoration: "none",
                transition: "color 300ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "black")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(0,0,0,0.6)")
              }
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              style={{
                color: "rgba(0,0,0,0.6)",
                textDecoration: "none",
                transition: "color 300ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "black")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(0,0,0,0.6)")
              }
            >
              Products
            </Link>
            <span>/</span>
            <span style={{ color: "black" }}>
              {product.category?.name || product.category || "Product"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Hero */}
      <section
        ref={heroRef}
        style={{
          padding: "clamp(3rem, 8vw, 5rem) 0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 3rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(3rem, 8vw, 5rem)",
            }}
          >
            {/* Image Gallery */}
            <div className="product-gallery">
              {/* Main Image */}
              <div
                style={{
                  aspectRatio: "1/1",
                  background: "#f5f5f5",
                  marginBottom: "1.5rem",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="main-product-image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/images/placeholder-product.jpg";
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(
                      4,
                      productImages.length
                    )}, 1fr)`,
                    gap: "1rem",
                  }}
                >
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      style={{
                        aspectRatio: "1/1",
                        background: "#f5f5f5",
                        border: `2px solid ${
                          selectedImage === index ? "black" : "rgba(0,0,0,0.1)"
                        }`,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 300ms ease",
                        padding: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (selectedImage !== index) {
                          e.currentTarget.style.borderColor = "rgba(0,0,0,0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedImage !== index) {
                          e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                        }
                      }}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/images/placeholder-product.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div style={{ marginBottom: "1rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "rgba(0,0,0,0.5)",
                  }}
                >
                  {product.brand ||
                    product.category?.name ||
                    product.category ||
                    "PRODUCT"}
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  marginBottom: "1.5rem",
                }}
              >
                {product.name}
              </h1>

              {/* Rating - Only show if has reviews */}
              {getReviewCount(product) > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        style={{
                          width: "16px",
                          height: "16px",
                          fill:
                            i < Math.floor(getRating(product.rating))
                              ? "black"
                              : "rgba(0,0,0,0.2)",
                        }}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    style={{ fontSize: "0.875rem", color: "rgba(0,0,0,0.6)" }}
                  >
                    {getRating(product.rating).toFixed(1)} (
                    {getReviewCount(product)} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    fontWeight: 300,
                  }}
                >
                  {formatINR(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.price > product.salePrice && (
                  <>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        color: "rgba(0,0,0,0.4)",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatINR(product.price)}
                    </span>
                    {discountPercent > 0 && (
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "#ef4444",
                          fontWeight: 500,
                        }}
                      >
                        Save {discountPercent}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "rgba(0,0,0,0.7)",
                  marginBottom: "2rem",
                }}
              >
                {product.description || product.shortDescription}
              </p>

              {/* Stock Status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "2rem",
                  padding: "1rem",
                  background: "#fafafa",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: product.inStock ? "#22c55e" : "#ef4444",
                  }}
                />
                <span style={{ fontSize: "0.875rem" }}>
                  {product.inStock
                    ? `In Stock${
                        product.stock ? ` (${product.stock} available)` : ""
                      }`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div style={{ marginBottom: "2rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.75rem",
                      color: "rgba(0,0,0,0.6)",
                    }}
                  >
                    Quantity
                    {getCartCount() > 0 && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          color: "rgba(0,0,0,0.4)",
                        }}
                      >
                        ({getCartCount()} total in cart)
                      </span>
                    )}
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        border: "2px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: "48px",
                          height: "48px",
                          background: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1.25rem",
                          transition: "all 300ms ease",
                          color: "black",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "black";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.color = "black";
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.min(
                              product.stock,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          )
                        }
                        style={{
                          width: "60px",
                          textAlign: "center",
                          border: "none",
                          borderLeft: "2px solid rgba(0,0,0,0.1)",
                          borderRight: "2px solid rgba(0,0,0,0.1)",
                          outline: "none",
                          fontSize: "1rem",
                        }}
                      />
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        style={{
                          width: "48px",
                          height: "48px",
                          background: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1.25rem",
                          transition: "all 300ms ease",
                          color: "black",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "black";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.color = "black";
                        }}
                      >
                        +
                      </button>
                    </div>
                    <span
                      style={{ fontSize: "0.875rem", color: "rgba(0,0,0,0.6)" }}
                    >
                      Max {product.stock}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  style={{
                    width: "100%",
                    padding: "1.25rem",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 500,
                    background:
                      product.inStock && !isAddingToCart
                        ? "black"
                        : "rgba(0,0,0,0.3)",
                    color: "white",
                    border: "none",
                    cursor:
                      product.inStock && !isAddingToCart
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 300ms ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (product.inStock && !isAddingToCart) {
                      e.currentTarget.style.background = "rgba(0,0,0,0.8)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (product.inStock && !isAddingToCart) {
                      e.currentTarget.style.background = "black";
                    }
                  }}
                >
                  {isAddingToCart
                    ? "Adding..."
                    : product.inStock
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>

                <button
                  onClick={handleAddToWishlist}
                  style={{
                    width: "100%",
                    padding: "1.25rem",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 500,
                    background: "white",
                    color: "black",
                    border: "2px solid black",
                    cursor: "pointer",
                    transition: "all 300ms ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "black";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "black";
                  }}
                >
                  Add to Wishlist
                </button>
              </div>

              {/* Product Meta */}
              <div
                style={{
                  padding: "1.5rem 0",
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  fontSize: "0.875rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "rgba(0,0,0,0.6)" }}>SKU:</span>
                  <span style={{ fontWeight: 500 }}>
                    {product.sku || "N/A"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "rgba(0,0,0,0.6)" }}>Category:</span>
                  <span style={{ fontWeight: 500 }}>
                    {product.category?.name || product.category || "N/A"}
                  </span>
                </div>
                {product.brand && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>Brand:</span>
                    <span style={{ fontWeight: 500 }}>{product.brand}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section
        ref={tabsRef}
        style={{
          padding: "clamp(3rem, 8vw, 5rem) 0",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 3rem)",
          }}
        >
          <div className="product-tabs">
            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                gap: "2rem",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                marginBottom: "3rem",
                flexWrap: "wrap",
              }}
            >
              {["description", "specifications", "features"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "1rem 0",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${
                      activeTab === tab ? "black" : "transparent"
                    }`,
                    color: activeTab === tab ? "black" : "rgba(0,0,0,0.5)",
                    cursor: "pointer",
                    transition: "all 300ms ease",
                    fontWeight: activeTab === tab ? 500 : 400,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "description" && (
                <div style={{ maxWidth: "800px" }}>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      lineHeight: 1.8,
                      color: "rgba(0,0,0,0.7)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {product.description ||
                      product.longDescription ||
                      product.shortDescription ||
                      "No description available"}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div style={{ maxWidth: "600px" }}>
                  {product.specifications &&
                  Object.keys(product.specifications).length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1px",
                        background: "rgba(0,0,0,0.1)",
                      }}
                    >
                      {Object.entries(product.specifications).map(
                        ([key, value]) => {
                          const formattedValue = formatSpecValue(value);
                          
                          // Skip if value is null or N/A after formatting
                          if (!formattedValue || formattedValue === 'N/A') {
                            return null;
                          }

                          return (
                            <div
                              key={key}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "1rem 1.5rem",
                                background: "white",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgba(0,0,0,0.6)",
                                  textTransform: "capitalize",
                                }}
                              >
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span style={{ fontWeight: 500 }}>
                                {formattedValue}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p style={{ color: "rgba(0,0,0,0.6)" }}>
                      No specifications available
                    </p>
                  )}
                </div>
              )}

              {activeTab === "features" && (
                <div style={{ maxWidth: "800px" }}>
                  {product.features && product.features.length > 0 ? (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {product.features.map((feature, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              background: "black",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              style={{
                                width: "14px",
                                height: "14px",
                                stroke: "white",
                              }}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span style={{ fontSize: "1rem", lineHeight: 1.6 }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "rgba(0,0,0,0.6)" }}>
                      No features listed
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section
          ref={featuredRef}
          style={{
            padding: "clamp(4rem, 10vw, 6rem) 0",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 clamp(1.5rem, 5vw, 3rem)",
            }}
          >
            <div
              className="featured-title"
              style={{
                textAlign: "center",
                marginBottom: "4rem",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  marginBottom: "1rem",
                }}
              >
                You May Also Like
              </h2>
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.125rem)",
                  color: "rgba(0,0,0,0.6)",
                  fontWeight: 300,
                }}
              >
                Related products from the same series
              </p>
            </div>

            <div
              className="featured-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              {featuredProducts.map((featuredProduct, i) => {
                const getFeaturedImage = () => {
                  if (
                    featuredProduct.images &&
                    featuredProduct.images.length > 0
                  ) {
                    const primaryImage = featuredProduct.images.find(
                      (img) => img.isPrimary
                    );
                    if (primaryImage) {
                      return typeof primaryImage === "string"
                        ? primaryImage
                        : primaryImage.url;
                    }
                    const firstImage = featuredProduct.images[0];
                    return typeof firstImage === "string"
                      ? firstImage
                      : firstImage.url;
                  }
                  return (
                    featuredProduct.mainImage ||
                    featuredProduct.image ||
                    "/images/placeholder-product.jpg"
                  );
                };

                const featuredImage = getFeaturedImage();

                return (
                  <Link
                    href={`/products/${featuredProduct.id}`}
                    key={i}
                    className="featured-card"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      border: "1px solid rgba(0,0,0,0.1)",
                      transition: "all 400ms ease",
                      display: "block",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "black";
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 20px 40px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1/1",
                        background: "#f5f5f5",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={featuredImage}
                        alt={featuredProduct.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 400ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                        onError={(e) => {
                          e.target.src = "/images/placeholder-product.jpg";
                        }}
                      />
                    </div>

                    <div style={{ padding: "1.5rem" }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "rgba(0,0,0,0.5)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {featuredProduct.category?.name ||
                          featuredProduct.category ||
                          "Product"}
                      </div>

                      <h3
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: 400,
                          marginBottom: "0.75rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {featuredProduct.name}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 300,
                          }}
                        >
                          {formatINR(featuredProduct.salePrice || featuredProduct.price)}
                        </span>

                        {getReviewCount(featuredProduct) > 0 && (
                          <div style={{ display: "flex", gap: "0.25rem" }}>
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  fill:
                                    i <
                                    Math.floor(
                                      getRating(featuredProduct.rating)
                                    )
                                      ? "black"
                                      : "rgba(0,0,0,0.2)",
                                }}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Spacing */}
      <div style={{ height: "3rem" }} />
    </div>
  );
}