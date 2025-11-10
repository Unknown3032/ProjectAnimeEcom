export const products = [
  {
    id: 1,
    name: 'Naruto Leaf Village Headband',
    category: 'shonen',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=500&h=600&fit=crop',
    featured: true,
    description: 'Authentic replica headband with premium metal plate',
    stock: 45,
    rating: 4.8,
    reviews: 124,
    tags: ['collectible', 'cosplay', 'accessories'],
    priceRange: 'under-50',
    availability: 'in-stock'
  },
  {
    id: 2,
    name: 'Attack on Titan Premium Poster Set',
    category: 'shonen',
    price: 34.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&h=600&fit=crop',
    featured: true,
    description: 'Museum-quality wall art collection',
    stock: 23,
    rating: 4.9,
    reviews: 89,
    tags: ['wall-art', 'limited-edition', 'home-decor'],
    priceRange: 'under-50',
    availability: 'in-stock'
  },
  {
    id: 3,
    name: 'Demon Slayer Tanjiro Elite Figure',
    category: 'shonen',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&h=600&fit=crop',
    featured: false,
    description: 'Hand-painted detailed collectible',
    stock: 12,
    rating: 5.0,
    reviews: 56,
    tags: ['figures', 'collectible', 'premium'],
    priceRange: '50-100',
    availability: 'low-stock'
  },
  {
    id: 4,
    name: 'Tokyo Ghoul Kaneki Signature Mask',
    category: 'seinen',
    price: 45.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=600&fit=crop',
    featured: true,
    description: 'Professional cosplay quality mask',
    stock: 8,
    rating: 4.7,
    reviews: 203,
    tags: ['cosplay', 'accessories', 'premium'],
    priceRange: 'under-50',
    availability: 'low-stock'
  },
  {
    id: 5,
    name: 'Berserk Deluxe Edition Box Set',
    category: 'seinen',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=500&h=600&fit=crop',
    featured: false,
    description: 'Complete deluxe hardcover collection',
    stock: 15,
    rating: 5.0,
    reviews: 178,
    tags: ['manga', 'collectible', 'limited-edition'],
    priceRange: 'over-100',
    availability: 'in-stock'
  },
  {
    id: 6,
    name: 'Sailor Moon Crystal Star Wand',
    category: 'shojo',
    price: 67.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=500&h=600&fit=crop',
    featured: true,
    description: 'LED light-up transformation wand',
    stock: 31,
    rating: 4.9,
    reviews: 312,
    tags: ['collectible', 'cosplay', 'electronics'],
    priceRange: '50-100',
    availability: 'in-stock'
  },
  {
    id: 7,
    name: 'Fruits Basket Zodiac Plush Collection',
    category: 'shojo',
    price: 54.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=500&h=600&fit=crop',
    featured: false,
    description: 'Complete zodiac animals set',
    stock: 19,
    rating: 4.6,
    reviews: 67,
    tags: ['plush', 'collectible', 'home-decor'],
    priceRange: '50-100',
    availability: 'in-stock'
  },
  {
    id: 8,
    name: 'Re:Zero Emilia Premium Scale Figure',
    category: 'isekai',
    price: 124.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&h=600&fit=crop',
    featured: true,
    description: '1/7 scale premium figure',
    stock: 7,
    rating: 5.0,
    reviews: 94,
    tags: ['figures', 'premium', 'limited-edition'],
    priceRange: 'over-100',
    availability: 'low-stock'
  },
  {
    id: 9,
    name: 'Sword Art Online Elucidator Replica',
    category: 'isekai',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&h=600&fit=crop',
    featured: false,
    description: 'Full-size metal replica sword',
    stock: 5,
    rating: 4.8,
    reviews: 45,
    tags: ['weapons', 'collectible', 'premium'],
    priceRange: 'over-100',
    availability: 'low-stock'
  },
  {
    id: 10,
    name: 'Gundam RX-78-2 Master Grade Kit',
    category: 'mecha',
    price: 79.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1531329466522-442f4a3c392c?w=500&h=600&fit=crop',
    featured: true,
    description: 'Premium model kit with LED',
    stock: 28,
    rating: 4.9,
    reviews: 267,
    tags: ['model-kits', 'collectible', 'hobby'],
    priceRange: '50-100',
    availability: 'in-stock'
  },
  {
    id: 11,
    name: 'Evangelion Unit-01 Limited Statue',
    category: 'mecha',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=600&fit=crop',
    featured: false,
    description: 'Limited edition numbered statue',
    stock: 3,
    rating: 5.0,
    reviews: 23,
    tags: ['figures', 'limited-edition', 'premium'],
    priceRange: 'over-100',
    availability: 'low-stock'
  },
  {
    id: 12,
    name: 'K-On! Premium Tea Set Collection',
    category: 'slice-of-life',
    price: 42.99,
    originalPrice: 54.99,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=500&h=600&fit=crop',
    featured: true,
    description: 'Fine ceramic tea set collection',
    stock: 22,
    rating: 4.7,
    reviews: 134,
    tags: ['kitchenware', 'collectible', 'home-decor'],
    priceRange: 'under-50',
    availability: 'in-stock'
  },
  // Add more products for infinite scroll
  {
    id: 13,
    name: 'One Piece Luffy Straw Hat',
    category: 'shonen',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=500&h=600&fit=crop',
    featured: false,
    description: 'Authentic straw hat replica',
    stock: 34,
    rating: 4.8,
    reviews: 156,
    tags: ['cosplay', 'accessories', 'collectible'],
    priceRange: 'under-50',
    availability: 'in-stock'
  },
  {
    id: 14,
    name: 'Death Note Premium Journal',
    category: 'seinen',
    price: 35.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=500&h=600&fit=crop',
    featured: true,
    description: 'Leather-bound replica notebook',
    stock: 41,
    rating: 4.9,
    reviews: 289,
    tags: ['collectible', 'stationery', 'premium'],
    priceRange: 'under-50',
    availability: 'in-stock'
  },
  {
    id: 15,
    name: 'Cardcaptor Sakura Wand Set',
    category: 'shojo',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=500&h=600&fit=crop',
    featured: false,
    description: 'Complete wand collection',
    stock: 11,
    rating: 5.0,
    reviews: 78,
    tags: ['collectible', 'cosplay', 'premium'],
    priceRange: '50-100',
    availability: 'low-stock'
  },
  {
    id: 16,
    name: 'Overlord Ainz Figure',
    category: 'isekai',
    price: 134.99,
    originalPrice: 169.99,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&h=600&fit=crop',
    featured: true,
    description: 'Premium collectible figure',
    stock: 9,
    rating: 4.9,
    reviews: 112,
    tags: ['figures', 'premium', 'collectible'],
    priceRange: 'over-100',
    availability: 'low-stock'
  }
];

export const categories = [
  { 
    slug: 'all', 
    name: 'All Products',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&h=600&fit=crop',
    description: 'Explore our complete anime collection'
  },
  { 
    slug: 'featured', 
    name: 'Featured Collection',
    bannerImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&h=600&fit=crop',
    description: 'Handpicked premium items for true fans'
  },
  { 
    slug: 'shonen', 
    name: 'Shonen',
    bannerImage: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1920&h=600&fit=crop',
    description: 'Action-packed adventures and epic battles'
  },
  { 
    slug: 'seinen', 
    name: 'Seinen',
    bannerImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=1920&h=600&fit=crop',
    description: 'Mature storytelling and complex narratives'
  },
  { 
    slug: 'shojo', 
    name: 'Shojo',
    bannerImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1920&h=600&fit=crop',
    description: 'Romance, drama, and heartfelt stories'
  },
  { 
    slug: 'isekai', 
    name: 'Isekai',
    bannerImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1920&h=600&fit=crop',
    description: 'Journey to fantastical other worlds'
  },
  { 
    slug: 'mecha', 
    name: 'Mecha',
    bannerImage: 'https://images.unsplash.com/photo-1531329466522-442f4a3c392c?w=1920&h=600&fit=crop',
    description: 'Giant robots and futuristic warfare'
  },
  { 
    slug: 'slice-of-life', 
    name: 'Slice of Life',
    bannerImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1920&h=600&fit=crop',
    description: 'Everyday moments and heartwarming tales'
  }
];

export const filterOptions = {
  priceRanges: [
    { value: 'all', label: 'All Prices' },
    { value: 'under-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: 'over-100', label: 'Over $100' }
  ],
  availability: [
    { value: 'all', label: 'All Items' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' }
  ],
  tags: [
    { value: 'collectible', label: 'Collectible' },
    { value: 'cosplay', label: 'Cosplay' },
    { value: 'figures', label: 'Figures' },
    { value: 'premium', label: 'Premium' },
    { value: 'limited-edition', label: 'Limited Edition' },
    { value: 'home-decor', label: 'Home Decor' }
  ],
  ratings: [
    { value: 'all', label: 'All Ratings' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4.0', label: '4.0+ Stars' }
  ]
};

export function getProductsBySlug(slug) {
  if (slug === 'all') {
    return products;
  }
  if (slug === 'featured') {
    return products.filter(product => product.featured);
  }
  return products.filter(product => product.category === slug);
}

export function getCategoryData(slug) {
  return categories.find(cat => cat.slug === slug) || categories[0];
}