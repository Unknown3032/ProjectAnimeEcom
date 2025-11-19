// Anime product data
export const categories = [
  { 
    id: 'all', 
    name: 'All Products', 
    color: '#ffffff',
    description: 'Complete Collection',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&h=400&fit=crop'
  },
  { 
    id: 'figures', 
    name: 'Anime Figures', 
    color: '#e5e5e5',
    description: 'Premium Collectibles',
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1200&h=400&fit=crop'
  },
  { 
    id: 'manga', 
    name: 'Manga', 
    color: '#d4d4d4',
    description: 'Best Selling Series',
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=1200&h=400&fit=crop'
  },
  { 
    id: 'apparel', 
    name: 'Apparel', 
    color: '#c4c4c4',
    description: 'Exclusive Streetwear',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=400&fit=crop'
  },
  { 
    id: 'accessories', 
    name: 'Accessories', 
    color: '#b4b4b4',
    description: 'Unique Items',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=400&fit=crop'
  },
  { 
    id: 'posters', 
    name: 'Art & Posters', 
    color: '#a4a4a4',
    description: 'Wall Decorations',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=400&fit=crop'
  },
];

export const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under25', label: 'Under $25', min: 0, max: 25 },
  { id: '25to50', label: '$25 - $50', min: 25, max: 50 },
  { id: '50to100', label: '$50 - $100', min: 50, max: 100 },
  { id: '100to200', label: '$100 - $200', min: 100, max: 200 },
  { id: 'over200', label: 'Over $200', min: 200, max: Infinity },
];

const animeProducts = {
  figures: [
    { name: 'Gojo Satoru Premium Figure', series: 'Jujutsu Kaisen', basePrice: 189 },
    { name: 'Luffy Gear 5 Scale Figure', series: 'One Piece', basePrice: 249 },
    { name: 'Mikasa Ackerman Figure', series: 'Attack on Titan', basePrice: 169 },
    { name: 'Nezuko Kamado DX Figure', series: 'Demon Slayer', basePrice: 159 },
    { name: 'Spike Spiegel Classic', series: 'Cowboy Bebop', basePrice: 199 },
    { name: 'Rem Crystal Dress Ver.', series: 'Re:Zero', basePrice: 279 },
    { name: 'Zero Two Darling Figure', series: 'Darling in the Franxx', basePrice: 229 },
    { name: 'Edward Elric Transmutation', series: 'Fullmetal Alchemist', basePrice: 189 },
  ],
  manga: [
    { name: 'Chainsaw Man Vol. 1-12', series: 'Chainsaw Man', basePrice: 89 },
    { name: 'Berserk Deluxe Edition Vol. 1', series: 'Berserk', basePrice: 45 },
    { name: 'Vagabond VIZBIG Edition', series: 'Vagabond', basePrice: 38 },
    { name: 'Monster Perfect Edition', series: 'Monster', basePrice: 42 },
    { name: 'Vinland Saga Hardcover', series: 'Vinland Saga', basePrice: 35 },
    { name: 'Tokyo Ghoul Complete Box Set', series: 'Tokyo Ghoul', basePrice: 159 },
    { name: 'Death Note Black Edition', series: 'Death Note', basePrice: 28 },
    { name: 'Attack on Titan Colossal Edition', series: 'Attack on Titan', basePrice: 52 },
  ],
  apparel: [
    { name: 'Akatsuki Cloud Hoodie', series: 'Naruto', basePrice: 68 },
    { name: 'Survey Corps Jacket', series: 'Attack on Titan', basePrice: 95 },
    { name: 'Straw Hat Pirates Tee', series: 'One Piece', basePrice: 32 },
    { name: 'Demon Slayer Haori', series: 'Demon Slayer', basePrice: 78 },
    { name: 'Jujutsu High Uniform', series: 'Jujutsu Kaisen', basePrice: 115 },
    { name: 'Evangelion NERV Bomber', series: 'Evangelion', basePrice: 125 },
    { name: 'Cowboy Bebop Spike Coat', series: 'Cowboy Bebop', basePrice: 145 },
    { name: 'Tokyo Revengers Jacket', series: 'Tokyo Revengers', basePrice: 98 },
  ],
  accessories: [
    { name: 'Death Note Replica', series: 'Death Note', basePrice: 45 },
    { name: 'Kakashi Sharingan Necklace', series: 'Naruto', basePrice: 28 },
    { name: 'Tanjiro Earrings Set', series: 'Demon Slayer', basePrice: 22 },
    { name: 'Straw Hat Replica', series: 'One Piece', basePrice: 38 },
    { name: 'Survey Corps Emblem Pin', series: 'Attack on Titan', basePrice: 15 },
    { name: 'Gojo Blindfold Premium', series: 'Jujutsu Kaisen', basePrice: 42 },
    { name: 'SEELE Logo Ring', series: 'Evangelion', basePrice: 55 },
    { name: 'Dragon Ball Scouter', series: 'Dragon Ball', basePrice: 68 },
  ],
  posters: [
    { name: 'Berserk Art Print Set', series: 'Berserk', basePrice: 35 },
    { name: 'Studio Ghibli Collection', series: 'Ghibli', basePrice: 48 },
    { name: 'Evangelion Minimalist Poster', series: 'Evangelion', basePrice: 25 },
    { name: 'Cowboy Bebop Vintage Print', series: 'Cowboy Bebop', basePrice: 32 },
    { name: 'Akira Kaneda Bike Canvas', series: 'Akira', basePrice: 58 },
    { name: 'Your Name Scenery Print', series: 'Your Name', basePrice: 42 },
    { name: 'One Piece Wanted Posters', series: 'One Piece', basePrice: 38 },
    { name: 'Chainsaw Man Art Book', series: 'Chainsaw Man', basePrice: 65 },
  ],
};

export const generateProducts = (start, count) => {
  const products = [];
  const categoryIds = Object.keys(animeProducts);
  
  for (let i = start; i < start + count; i++) {
    const categoryId = categoryIds[i % categoryIds.length];
    const categoryProducts = animeProducts[categoryId];
    const productTemplate = categoryProducts[i % categoryProducts.length];
    
    products.push({
      id: i + 1,
      name: productTemplate.name,
      series: productTemplate.series,
      category: categoryId === 'figures' ? 'figures' : 
                categoryId === 'manga' ? 'manga' : 
                categoryId === 'apparel' ? 'apparel' : 
                categoryId === 'accessories' ? 'accessories' : 'posters',
      price: productTemplate.basePrice + Math.floor(Math.random() * 20) - 10,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 800) + 50,
      image: `https://picsum.photos/seed/anime${i}/600/800?grayscale`,
      inStock: Math.random() > 0.15,
      limited: Math.random() > 0.7,
      new: i < 8,
    });
  }
  
  return products;
};

export const filterProducts = (products, category, priceRange, searchQuery) => {
  return products.filter(product => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.series.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });
};