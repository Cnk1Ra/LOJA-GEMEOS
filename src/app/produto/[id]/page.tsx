'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProductById, getRelatedProducts, products } from '@/data/products';

// Placeholder images for different product types
const placeholderImages = {
  edredon: [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&h=600&fit=crop',
  ],
  lencol: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578898395414-9d67441ba2a5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&h=600&fit=crop',
  ],
  fronha: [
    'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=600&h=600&fit=crop',
  ],
  colcha: [
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587815073078-f636169821e3?w=600&h=600&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=600&fit=crop',
  ],
};

// Get a unique placeholder based on product ID and type
const getPlaceholderImage = (id: string, description: string): string => {
  const desc = description.toLowerCase();

  let category: keyof typeof placeholderImages = 'default';
  if (desc.includes('kołdr') || desc.includes('pościel')) {
    category = 'edredon';
  } else if (desc.includes('prześcieradł')) {
    category = 'lencol';
  } else if (desc.includes('poszewk') || desc.includes('poduszk')) {
    category = 'fronha';
  } else if (desc.includes('narzut') || desc.includes('koc') || desc.includes('pled')) {
    category = 'colcha';
  }

  const images = placeholderImages[category];
  const numericId = parseInt(id.replace(/\D/g, '')) || id.charCodeAt(0);
  const index = numericId % images.length;

  return images[index];
};

const sizes = [
  { id: '1', name: '140 x 200 cm (Łóżko 90/100 cm)', originalPrice: 259.99, price: 159.99 },
  { id: '2', name: '200 x 200 cm (Łóżko 140 cm)', originalPrice: 349.99, price: 219.99 },
  { id: '3', name: '240 x 220 cm (Łóżko 140/160 cm)', originalPrice: 359.99, price: 229.99 },
  { id: '4', name: '260 x 240 cm (Łóżko 160/180 cm)', originalPrice: 499.99, price: 319.99 },
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<typeof sizes[0] | null>(sizes[0]);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Get real product data or fallback
  const realProduct = getProductById(productId);
  const relatedProductsData = realProduct ? getRelatedProducts(realProduct, 4) : products.slice(0, 4);

  const product = realProduct ? {
    name: realProduct.description,
    brand: 'SORELLE',
    rating: realProduct.rating,
    reviewCount: Math.floor(Math.random() * 50) + 10,
    description: `Kolor: ${realProduct.subcategory}`,
    image: realProduct.image,
    price: realProduct.price,
    originalPrice: realProduct.originalPrice,
    discount: realProduct.discount,
    colors: realProduct.colors,
    subcategory: realProduct.subcategory,
  } : {
    name: 'Pościel bawełniana premium',
    brand: 'SORELLE',
    rating: 4.8,
    reviewCount: 127,
    description: 'Kolor: Wzorzysty',
    image: undefined,
    price: 159.99,
    originalPrice: 259.99,
    discount: 38,
    colors: ['#4a90d9', '#ffffff', '#f5f5dc', '#ffc0cb'],
    subcategory: 'Pościel',
  };

  const colors = product.colors.map((color, i) => ({
    id: String(i + 1),
    name: `Kolor ${i + 1}`,
    color: color,
    image: product.image,
  }));

  // Track recently viewed
  useEffect(() => {
    if (typeof window !== 'undefined' && realProduct) {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const productData = {
        id: productId,
        name: realProduct.name,
        description: realProduct.description,
        price: realProduct.price,
        originalPrice: realProduct.originalPrice,
        discount: realProduct.discount,
        image: realProduct.image,
        href: `/produto/${productId}`,
        subcategory: realProduct.subcategory
      };
      const filtered = viewed.filter((p: { id: string }) => p.id !== productId);
      filtered.unshift(productData);
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
    }
  }, [productId, realProduct]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeModal(true);
      return;
    }

    const cartItem = {
      id: `${productId}-${selectedSize.id}-${Date.now()}`,
      name: product.brand,
      description: product.name,
      color: colors[selectedColorIndex]?.name || 'Standardowy',
      size: selectedSize.name,
      ref: productId,
      price: selectedSize.price,
      originalPrice: selectedSize.originalPrice,
      quantity: quantity,
      delivery: 'Dostawa w 3-5 dni roboczych',
      image: product.image || getPlaceholderImage(productId, product.name),
    };

    const existingCart = JSON.parse(localStorage.getItem('lojaGemeosCart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('lojaGemeosCart', JSON.stringify(existingCart));

    router.push('/carrinho');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Breadcrumb */}
      <div className="px-4 py-3 text-sm text-gray-500">
        <Link href="/" className="hover:text-black">...</Link>
        <span className="mx-2">/</span>
        <Link href="/cama" className="hover:text-black">Pościel</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.subcategory || 'Kołdry'}</span>
      </div>

      {/* Product Image Gallery */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={imageError || !product.image ? getPlaceholderImage(productId, product.name) : product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3, 4].map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-gray-800' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Badge */}
        {product.discount && product.discount > 0 && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        <p className="text-sm font-bold text-gray-800 uppercase">{product.brand}</p>
        <h1 className="text-xl font-semibold text-gray-800 mt-1">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount} opinii)</span>
        </div>

        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
      </div>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Kolor: {colors[selectedColorIndex]?.name}</p>
          <div className="flex gap-2">
            {colors.map((color, index) => (
              <button
                key={color.id}
                onClick={() => setSelectedColorIndex(index)}
                className={`w-12 h-12 rounded-lg border-2 ${
                  selectedColorIndex === index ? 'border-black' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={() => setShowSizeModal(true)}
          className="w-full flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg"
        >
          <span className="text-gray-700">
            {selectedSize ? selectedSize.name : 'Wybierz rozmiar'}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Quantity */}
      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-3">Ilość</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-gray-500">od</span>
          <span className="text-2xl font-bold text-gray-800">
            {(selectedSize?.price || product.price).toFixed(2).replace('.', ',')} zł
          </span>
        </div>
        <p className="text-sm mt-1">
          <span className="line-through text-gray-400">
            {(selectedSize?.originalPrice || product.originalPrice).toFixed(2).replace('.', ',')} zł
          </span>
          <span className="text-red-600 font-semibold ml-2">
            -{product.discount}%
          </span>
        </p>
      </div>

      {/* Delivery Info */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <p className="font-bold text-amber-800">Płatność przy odbiorze</p>
            <p className="text-sm text-amber-700">Zapłać kurierowi przy dostawie</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-gray-700">Darmowa dostawa powyżej 200 zł</span>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm text-gray-700">30 dni na zwrot lub wymianę</span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-4 py-6 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Pasujące produkty</h2>
        <div className="grid grid-cols-2 gap-4">
          {relatedProductsData.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              name={prod.name}
              description={prod.description}
              price={prod.price}
              originalPrice={prod.originalPrice}
              discount={prod.discount}
              rating={prod.rating}
              colors={prod.colors}
              moreColors={prod.moreColors}
              badge={prod.badge}
              href={prod.href}
              image={prod.image}
              subcategory={prod.subcategory}
            />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4 py-6 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Opinie klientów</h2>
        <div className="space-y-3">
          {[
            { label: 'Stosunek jakości do ceny', rating: 5 },
            { label: 'Ogólne zadowolenie/Styl', rating: 4 },
            { label: 'Miękkość/Przyjemny dotyk', rating: 5 },
            { label: 'Trwałość', rating: 4 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.label}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= item.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSizeModal(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-4 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Wybierz rozmiar</h2>
              <button onClick={() => setShowSizeModal(false)} className="p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">Poszewki na poduszki sprzedawane osobno</span>
              </div>

              <div className="space-y-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowSizeModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 border rounded-lg ${
                      selectedSize?.id === size.id ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-gray-800">{size.name}</span>
                    <div className="text-right">
                      <span className="line-through text-gray-400 text-sm mr-2">
                        {size.originalPrice.toFixed(2).replace('.', ',')} zł
                      </span>
                      <span className="font-bold text-gray-800">
                        {size.price.toFixed(2).replace('.', ',')} zł
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
        <button
          onClick={handleAddToCart}
          className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors"
        >
          DODAJ DO KOSZYKA - {((selectedSize?.price || product.price) * quantity).toFixed(2).replace('.', ',')} zł
        </button>
      </div>
    </div>
  );
}
