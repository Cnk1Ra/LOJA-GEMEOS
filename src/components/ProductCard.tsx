'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  colors?: string[];
  moreColors?: number;
  badge?: string;
  image?: string;
  href: string;
}

// Polish names for social proof
const polishNames = [
  'Anna K.', 'Marta W.', 'Katarzyna M.', 'Agnieszka P.', 'Magdalena S.',
  'Joanna B.', 'Monika T.', 'Ewa R.', 'Aleksandra N.', 'Patrycja L.',
  'Karolina D.', 'Natalia G.', 'Justyna H.', 'Paulina Z.', 'Dominika C.'
];

export default function ProductCard({
  id,
  description,
  price,
  originalPrice,
  discount,
  rating = 4.5,
  colors = [],
  moreColors = 0,
  image,
  href
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Generate consistent random values based on product id
  const socialProof = useMemo(() => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const peopleCount = 50 + (hash % 200); // 50-250 people
    const reviewerIndex = hash % polishNames.length;
    return {
      peopleCount,
      reviewerName: polishNames[reviewerIndex]
    };
  }, [id]);

  return (
    <div className="relative group">
      {/* Product Image */}
      <Link href={href} className="block">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          {image ? (
            <img
              src={image}
              alt={description}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Discount Badge */}
          {discount && (
            <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Dodaj do ulubionych"
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        <Link href={href}>
          <p className="text-sm text-gray-700 line-clamp-2 font-medium">{description}</p>
        </Link>

        {/* Price */}
        <div className="pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-gray-900 text-lg">
              {price.toFixed(2).replace('.', ',')} zł
            </span>
            {originalPrice && (
              <span className="line-through text-gray-400 text-sm">
                {originalPrice.toFixed(2).replace('.', ',')} zł
              </span>
            )}
          </div>
        </div>

        {/* Rating with 5 stars and review count */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">({socialProof.peopleCount} opinii)</span>
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
            {moreColors > 0 && (
              <span className="text-xs text-gray-500 ml-1">+{moreColors}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
