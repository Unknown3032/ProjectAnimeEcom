'use client';

import Link from 'next/link';

export default function ProductCard({ product }) {
  const { name, slug, price, originalPrice, image, anime, category } = product;

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <Link
      href={`/product/${slug}`}
      className="block product-card group bg-white text-black rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
    >
      <div className="aspect-square w-full bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-md font-medium line-clamp-2">{name}</h3>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="line-through text-sm text-gray-400">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="ml-auto text-xs text-red-500">
                -{discount}%
              </span>
            </>
          )}
        </div>

        <p className="text-xs text-gray-500">{anime || category}</p>
      </div>
    </Link>
  );
}