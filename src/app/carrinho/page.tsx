'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

interface CartItem {
  id: string;
  name: string;
  description: string;
  color: string;
  size: string;
  ref: string;
  price: number;
  originalPrice: number;
  quantity: number;
  delivery: string;
  image: string;
}

interface RecentProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  href: string;
  image?: string;
  subcategory?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProduct[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Extras state
  const [giftWrap, setGiftWrap] = useState(false);
  const [ecoPackaging, setEcoPackaging] = useState(false);
  const [priorityDelivery, setPriorityDelivery] = useState(false);

  const giftWrapPrice = giftWrap ? 9.99 : 0;
  const ecoPrice = ecoPackaging ? 4.99 : 0;
  const priorityPrice = priorityDelivery ? 19.99 : 0;

  useEffect(() => {
    const savedCart = localStorage.getItem('lojaGemeosCart');
    const recentViewed = localStorage.getItem('recentlyViewed');

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }

    if (recentViewed) {
      try {
        const viewed = JSON.parse(recentViewed);
        setRecentlyViewed(viewed.slice(0, 4));
      } catch (e) {
        console.error('Error loading recently viewed:', e);
      }
    }

    setIsLoaded(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const savings = originalTotal - subtotal;
  const extrasTotal = giftWrapPrice + ecoPrice + priorityPrice;
  const shippingCost = subtotal >= 200 ? 0 : 14.99;
  const total = subtotal + extrasTotal + shippingCost;

  const updateQuantity = (id: string, delta: number) => {
    const newItems = items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setItems(newItems);
    localStorage.setItem('lojaGemeosCart', JSON.stringify(newItems));
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    localStorage.setItem('lojaGemeosCart', JSON.stringify(newItems));
  };

  const handleCheckout = () => {
    // Save extras to localStorage
    localStorage.setItem('lojaGemeosExtras', JSON.stringify({
      giftWrap,
      ecoPackaging,
      priorityDelivery,
      giftWrapPrice,
      ecoPrice,
      priorityPrice
    }));
    router.push('/checkout');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Twój koszyk jest pusty</h1>
          <p className="text-gray-500 mb-6">Dodaj produkty do koszyka, aby kontynuować zakupy</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Kontynuuj zakupy
          </Link>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="w-full max-w-2xl mt-12 px-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ostatnio oglądane</h2>
            <div className="grid grid-cols-2 gap-4">
              {recentlyViewed.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  href={product.href}
                  image={product.image}
                  subcategory={product.subcategory}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Breadcrumb Steps */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-center py-4 px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-black">Koszyk</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Adres</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Potwierdzenie</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="bg-white px-4 py-3 border-b">
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kontynuuj zakupy
        </Link>
      </div>

      {/* Cart Header */}
      <div className="bg-white px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Koszyk ({items.length})</h1>

        {/* Free Shipping Progress */}
        {subtotal < 200 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-800">Darmowa dostawa od 200 zł</span>
              <span className="font-bold text-amber-800">Brakuje: {(200 - subtotal).toFixed(2).replace('.', ',')} zł</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {subtotal >= 200 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Masz darmową dostawę!</span>
            </div>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="bg-white mt-2 px-4 py-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
            {/* Product Image */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.description} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg"></div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 uppercase">{item.name}</p>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{item.description}</p>

              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  {item.delivery}
                </p>
                <p>Kolor: {item.color}</p>
                <p>{item.size}</p>
              </div>

              {/* Price */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="line-through text-gray-400 text-sm">
                    {item.originalPrice.toFixed(2).replace('.', ',')} zł
                  </span>
                  <span className="text-lg font-bold text-black">
                    {item.price.toFixed(2).replace('.', ',')} zł
                  </span>
                </div>
                <p className="text-xs text-green-600">Oszczędzasz {(item.originalPrice - item.price).toFixed(2).replace('.', ',')} zł</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-sm text-red-600 hover:underline">
                  Usuń
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extras */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-bold text-gray-800 mb-4">Dodatkowe opcje</h2>

        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
            </svg>
            <div>
              <p className="font-medium text-gray-800">Pakowanie na prezent</p>
              <p className="text-xs text-gray-500">Eleganckie opakowanie z wstążką</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">+9,99 zł</span>
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="w-5 h-5 accent-amber-500"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div>
              <p className="font-medium text-gray-800">Ekologiczne opakowanie</p>
              <p className="text-xs text-gray-500">W 100% biodegradowalne materiały</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">+4,99 zł</span>
            <input
              type="checkbox"
              checked={ecoPackaging}
              onChange={(e) => setEcoPackaging(e.target.checked)}
              className="w-5 h-5 accent-green-500"
            />
          </div>
        </label>

        <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            <div>
              <p className="font-medium text-gray-800">Dostawa priorytetowa</p>
              <p className="text-xs text-gray-500">Dostawa w ciągu 24-48h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">+19,99 zł</span>
            <input
              type="checkbox"
              checked={priorityDelivery}
              onChange={(e) => setPriorityDelivery(e.target.checked)}
              className="w-5 h-5 accent-blue-500"
            />
          </div>
        </label>
      </div>

      {/* Promo Code */}
      <div className="bg-white mt-2 px-4 py-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Kod promocyjny</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Wpisz kod"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
            OK
          </button>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white mt-2 px-4 py-4 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <span className="font-bold text-amber-800">Płatność przy odbiorze</span>
            <p className="text-sm text-amber-700">Zapłać kurierowi przy dostawie</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm text-gray-700">30 dni na zwrot</span>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="bg-white mt-2 px-4 py-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ostatnio oglądane</h2>
          <div className="grid grid-cols-2 gap-4">
            {recentlyViewed.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                href={product.href}
                image={product.image}
                subcategory={product.subcategory}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        {/* Order Summary */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Produkty</span>
            <span>{subtotal.toFixed(2).replace('.', ',')} zł</span>
          </div>
          {extrasTotal > 0 && (
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Dodatki</span>
              <span>+{extrasTotal.toFixed(2).replace('.', ',')} zł</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Dostawa</span>
            <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
              {shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2).replace('.', ',')} zł`}
            </span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Oszczędzasz</span>
              <span>-{savings.toFixed(2).replace('.', ',')} zł</span>
            </div>
          )}
        </div>

        {/* Total & CTA */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Razem do zapłaty</p>
            <p className="text-2xl font-bold text-black">{total.toFixed(2).replace('.', ',')} zł</p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-amber-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors"
          >
            PRZEJDŹ DO KASY
          </button>
        </div>
      </div>
    </div>
  );
}
