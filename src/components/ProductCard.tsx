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
  subcategory?: string;
}

// Polish names for social proof
const polishNames = [
  'Anna K.', 'Marta W.', 'Katarzyna M.', 'Agnieszka P.', 'Magdalena S.',
  'Joanna B.', 'Monika T.', 'Ewa R.', 'Aleksandra N.', 'Patrycja L.',
  'Beata Z.', 'Dorota J.', 'Iwona C.', 'Karolina D.', 'Justyna G.',
  'Natalia H.', 'Sylwia F.', 'Barbara O.', 'Renata U.', 'Teresa Y.'
];

// Product-specific social proof comments
const socialProofComments: { [key: string]: string[] } = {
  'Capas de Edredon': [
    'Świetna jakość materiału!',
    'Mięciutka i przyjemna w dotyku',
    'Piękne kolory, jak na zdjęciu',
    'Rewelacyjna pościel, polecam!',
    'Córka jest zachwycona',
    'Bardzo elegancka, premium jakość'
  ],
  'Lençóis-Capa': [
    'Idealnie pasuje na materac',
    'Nie marszczy się w nocy',
    'Super jakość za tę cenę',
    'Polecam, kupię więcej',
    'Miękkie i wygodne'
  ],
  'Lençóis': [
    'Cudownie miękkie prześcieradło',
    'Świetnie się pierze',
    'Doskonała jakość bawełny',
    'Bardzo przyjemne w dotyku'
  ],
  'Fronhas': [
    'Idealne do mojej pościeli',
    'Świetna jakość materiału',
    'Mięciutkie, polecam!',
    'Piękny kolor, jak na zdjęciu'
  ],
  'Conjuntos': [
    'Komplet wygląda przepięknie',
    'Świetna jakość całego zestawu',
    'Polecam, pięknie wygląda w sypialni',
    'Znakomita jakość wykończenia'
  ],
  'Colchas': [
    'Piękna narzuta, rewelacja!',
    'Elegancko wygląda na łóżku',
    'Świetna jakość, polecam',
    'Bardzo miękka i ciepła'
  ],
  'default': [
    'Świetny produkt!',
    'Polecam, warto kupić',
    'Bardzo dobra jakość',
    'Jestem zadowolona z zakupu'
  ]
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  discount,
  rating,
  colors = [],
  moreColors = 0,
  badge,
  image,
  href,
  subcategory
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Generate consistent social proof based on product ID
  const socialProof = useMemo(() => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Generate rating between 4.5 and 5.0
    const generatedRating = 4.5 + (hash % 6) / 10;

    // Generate review count between 47 and 312
    const reviewCount = 47 + (hash % 265);

    // Generate people viewing count
    const peopleViewing = 12 + (hash % 89);

    // Get random reviewer name
    const reviewerName = polishNames[hash % polishNames.length];

    // Get product-specific comment
    const category = subcategory || 'default';
    const comments = socialProofComments[category] || socialProofComments['default'];
    const comment = comments[hash % comments.length];

    return {
      rating: generatedRating,
      reviewCount,
      peopleViewing,
      reviewerName,
      comment
    };
  }, [id, subcategory]);

  // Track recently viewed products
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const productData = { id, name, description, price, originalPrice, discount, image, href, subcategory };
      const filtered = viewed.filter((p: { id: string }) => p.id !== id);
      filtered.unshift(productData);
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
    }
  };

  return (
    <div className="relative group">
      {/* Product Image */}
      <Link href={href} className="block" onClick={handleClick}>
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
          {discount && discount > 0 && (
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
        <Link href={href} onClick={handleClick}>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </Link>

        {/* Price */}
        <div className="pt-1">
          <p className="text-sm text-gray-500">
            od{' '}
            <span className="font-bold text-gray-900 text-lg">
              {price.toFixed(2).replace('.', ',')} zł
            </span>
          </p>
          {originalPrice && discount && discount > 0 && (
            <p className="text-sm">
              <span className="line-through text-gray-400">{originalPrice.toFixed(2).replace('.', ',')} zł</span>
            </p>
          )}
        </div>

        {/* Rating and Social Proof */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{socialProof.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({socialProof.reviewCount})</span>
          </div>
          <span className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            {socialProof.peopleViewing} osób ogląda
          </span>
        </div>

        {/* Social Proof Comment */}
        <div className="pt-1 text-xs text-gray-500 italic">
          &ldquo;{socialProof.comment}&rdquo; - {socialProof.reviewerName}
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {colors.slice(0, 3).map((color, index) => (
              <span
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
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
