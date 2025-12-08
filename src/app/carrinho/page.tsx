'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

// Get real products for upsells
const upsellProducts = products.filter(p => p.subcategory === 'Fronhas').slice(0, 4);

interface CartItem {
  id: string;
  name: string;
  description: string;
  color: string;
  size: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  subcategory?: string;
}

const FREE_SHIPPING_THRESHOLD = 200;

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  // Upsell options
  const [giftWrap, setGiftWrap] = useState(false);
  const [ecoPackaging, setEcoPackaging] = useState(false);
  const [priorityDelivery, setPriorityDelivery] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('lojaGemeosCart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lojaGemeosCart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const savings = originalTotal - subtotal;

  // Calculate extras (in PLN)
  const giftWrapPrice = giftWrap ? 25 : 0;
  const ecoPrice = ecoPackaging ? 5 : 0;
  const priorityPrice = priorityDelivery ? 35 : 0;
  const extrasTotal = giftWrapPrice + ecoPrice + priorityPrice;

  // Shipping calculation (in PLN)
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 14.99;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const total = subtotal + extrasTotal + shippingCost;

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // Save upsell selections to localStorage
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
          <p className="text-gray-500 mb-6">Odkryj nasze produkty i dodaj je do koszyka</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Kontynuuj zakupy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-40">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold">Koszyk ({items.length})</h1>
          <div className="w-5"></div>
        </div>
      </div>

      {/* Payment on Delivery Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <p className="font-bold text-amber-800">Płatność przy odbiorze</p>
            <p className="text-sm text-amber-700">Zapłać kurierowi przy dostawie - 100% bezpieczne</p>
          </div>
        </div>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="bg-white px-4 py-4 border-b">
        {shippingCost === 0 ? (
          <div className="flex items-center gap-3 text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Gratulacje! Masz darmową dostawę!</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-sm">
                Brakuje <strong>{amountToFreeShipping.toFixed(2).replace('.', ',')} zł</strong> do darmowej dostawy!
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              ></div>
            </div>
          </>
        )}
      </div>

      {/* Cart Items */}
      <div className="bg-white mt-2">
        {items.map((item, index) => (
          <div key={item.id} className={`p-4 ${index !== items.length - 1 ? 'border-b' : ''}`}>
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.description} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.description}</p>

                <div className="text-xs text-gray-500 mt-1">
                  <span>{item.color}</span>
                  {item.size && <span> • {item.size}</span>}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-black">
                    {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="line-through text-gray-400 text-sm">
                      {(item.originalPrice * item.quantity).toFixed(2).replace('.', ',')} zł
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Controls & Remove */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkbox Upsells */}
      <div className="bg-white mt-2 p-4">
        <h3 className="font-bold text-gray-800 mb-3">Opcje dodatkowe</h3>

        {/* Gift Wrap */}
        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:border-amber-500 transition-colors">
          <input
            type="checkbox"
            checked={giftWrap}
            onChange={(e) => setGiftWrap(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-amber-500"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8l10-5.6L22 12zm-2 0l-8-4.5L4 12v8h16v-8zM12 2L4 6l8 4.5L20 6l-8-4z"/>
                </svg>
                <span className="font-medium text-gray-800">Opakowanie prezentowe</span>
              </div>
              <span className="font-bold text-black">+25,00 zł</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Eleganckie opakowanie z kokardą i karteczką z życzeniami</p>
          </div>
        </label>

        {/* Eco Packaging */}
        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:border-amber-500 transition-colors">
          <input
            type="checkbox"
            checked={ecoPackaging}
            onChange={(e) => setEcoPackaging(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-amber-500"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 3.12 13.38 2 12 2S9.5 3.12 9.5 4.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5z"/>
                </svg>
                <span className="font-medium text-gray-800">Opakowanie ekologiczne</span>
              </div>
              <span className="font-bold text-black">+5,00 zł</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">100% materiały z recyklingu i nadające się do recyklingu</p>
          </div>
        </label>

        {/* Priority Delivery */}
        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
          <input
            type="checkbox"
            checked={priorityDelivery}
            onChange={(e) => setPriorityDelivery(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-amber-500"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <span className="font-medium text-gray-800">Dostawa ekspresowa</span>
              </div>
              <span className="font-bold text-black">+35,00 zł</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Dostawa w 24-48 godzin roboczych</p>
          </div>
        </label>
      </div>

      {/* Promo Code */}
      <div className="bg-white mt-2 p-4">
        <p className="font-medium text-gray-800 mb-2">Kod promocyjny</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Wpisz kod"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
          />
          <button className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
            Zastosuj
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white mt-2 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-sm text-gray-700">Płatność przy odbiorze - zapłać kurierowi</span>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          <span className="text-sm text-gray-700">Darmowy zwrot w ciągu 30 dni</span>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
          <span className="text-sm text-gray-700">Gwarancja jakości premium</span>
        </div>
      </div>

      {/* Upsell Products */}
      <div className="bg-white mt-2 p-4">
        <h2 className="font-bold text-gray-800 mb-4">Uzupełnij swoją sypialnię</h2>
        <div className="grid grid-cols-2 gap-3">
          {upsellProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              rating={product.rating}
              colors={product.colors}
              badge={product.badge}
              href={product.href}
              image={product.image}
            />
          ))}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-40">
        {/* Order Summary */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Suma częściowa</span>
            <span>{subtotal.toFixed(2).replace('.', ',')} zł</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600 mb-1">
              <span>Oszczędzasz</span>
              <span>-{savings.toFixed(2).replace('.', ',')} zł</span>
            </div>
          )}
          {extrasTotal > 0 && (
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Dodatki</span>
              <span>+{extrasTotal.toFixed(2).replace('.', ',')} zł</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Dostawa</span>
            <span>{shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2).replace('.', ',')} zł`}</span>
          </div>
        </div>

        {/* Total & CTA */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Do zapłaty przy odbiorze</p>
            <p className="text-2xl font-bold text-black">{total.toFixed(2).replace('.', ',')} zł</p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-amber-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors"
          >
            ZAMÓW
          </button>
        </div>
      </div>
    </div>
  );
}
