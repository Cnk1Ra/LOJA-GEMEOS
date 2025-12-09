'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';

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
}

interface Extras {
  giftWrap: boolean;
  ecoPackaging: boolean;
  priorityDelivery: boolean;
  giftWrapPrice: number;
  ecoPrice: number;
  priorityPrice: number;
}

interface UpsellItem {
  id: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  selected: boolean;
}

// Polish voivodeships
const voivodeships = [
  'Dolnośląskie', 'Kujawsko-Pomorskie', 'Lubelskie', 'Lubuskie',
  'Łódzkie', 'Małopolskie', 'Mazowieckie', 'Opolskie',
  'Podkarpackie', 'Podlaskie', 'Pomorskie', 'Śląskie',
  'Świętokrzyskie', 'Warmińsko-Mazurskie', 'Wielkopolskie', 'Zachodniopomorskie'
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [extras, setExtras] = useState<Extras | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastName: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    voivodeship: 'Mazowieckie',
    notes: '',
    saveAddress: true
  });

  const [step, setStep] = useState<'address' | 'confirmation' | 'upsell'>('address');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [upsellItems, setUpsellItems] = useState<UpsellItem[]>([]);
  const [upsellTotal, setUpsellTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shopifyOrderId, setShopifyOrderId] = useState<string | null>(null);

  // Load cart data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('lojaGemeosCart');
    const savedExtras = localStorage.getItem('lojaGemeosExtras');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }

    if (savedExtras) {
      try {
        setExtras(JSON.parse(savedExtras));
      } catch (e) {
        console.error('Error loading extras:', e);
      }
    }

    setIsLoaded(true);
  }, []);

  // Load upsell products from recently viewed
  const loadUpsellProducts = useCallback(() => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const cartIds = cartItems.map(item => item.id);

    // Filter out products already in cart
    const availableProducts = recentlyViewed
      .filter((id: string) => !cartIds.includes(id))
      .slice(0, 3);

    // If not enough recently viewed, add random products
    if (availableProducts.length < 3) {
      const randomProducts = products
        .filter(p => !cartIds.includes(p.id) && !availableProducts.includes(p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - availableProducts.length)
        .map(p => p.id);
      availableProducts.push(...randomProducts);
    }

    // Convert to upsell items
    const upsells: UpsellItem[] = availableProducts.map((id: string) => {
      const product = products.find(p => p.id === id);
      if (!product) return null;
      return {
        id: product.id,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        selected: false
      };
    }).filter((item: UpsellItem | null): item is UpsellItem => item !== null);

    setUpsellItems(upsells);
  }, [cartItems]);

  // Complete order function - sends to Shopify
  const completeOrder = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate totals inside callback
    const calcSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calcExtrasTotal = extras ? (extras.giftWrapPrice + extras.ecoPrice + extras.priorityPrice) : 0;
    const calcShippingCost = calcSubtotal >= 200 ? 0 : 14.99;
    const calcTotal = calcSubtotal + calcExtrasTotal + calcShippingCost + upsellTotal;

    try {
      // Prepare order data for Shopify
      const orderData = {
        email: formData.email,
        name: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        voivodeship: formData.voivodeship,
        notes: formData.notes,
        cartItems: cartItems,
        upsellItems: upsellItems,
        subtotal: calcSubtotal,
        shippingCost: calcShippingCost,
        extrasTotal: calcExtrasTotal,
        upsellTotal: upsellTotal,
        total: calcTotal
      };

      // Send order to Shopify via our API
      const response = await fetch('/api/shopify/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      let finalOrderNumber = '';
      let finalShopifyOrderId = '';

      if (result.success) {
        finalOrderNumber = result.orderName || `#${result.orderNumber}`;
        finalShopifyOrderId = result.orderId;
        setOrderNumber(finalOrderNumber);
        setShopifyOrderId(finalShopifyOrderId);
      } else {
        // Fallback to local order number if Shopify fails
        console.error('Shopify order creation failed:', result.error);
        finalOrderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
        setOrderNumber(finalOrderNumber);
      }

      // Clear cart regardless of Shopify result
      localStorage.removeItem('lojaGemeosCart');
      localStorage.removeItem('lojaGemeosExtras');

      setOrderComplete(true);
    } catch (error) {
      console.error('Error completing order:', error);
      // Fallback to local order number on error
      const fallbackOrderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
      setOrderNumber(fallbackOrderNum);

      localStorage.removeItem('lojaGemeosCart');
      localStorage.removeItem('lojaGemeosExtras');

      setOrderComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, formData, cartItems, extras, upsellItems, upsellTotal]);

  // Auto-confirm order if user leaves during upsell
  useEffect(() => {
    if (step !== 'upsell') return;

    const handleBeforeUnload = () => {
      // Auto-confirm the order
      completeOrder();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, completeOrder]);

  // Calculate totals (in PLN)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const extrasTotal = extras ? (extras.giftWrapPrice + extras.ecoPrice + extras.priorityPrice) : 0;
  const shippingCost = subtotal >= 200 ? 0 : 14.99;
  const total = subtotal + extrasTotal + shippingCost + upsellTotal;

  // Toggle upsell item selection
  const toggleUpsellItem = (id: string) => {
    setUpsellItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      // Recalculate upsell total
      const newUpsellTotal = updated
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price, 0);
      setUpsellTotal(newUpsellTotal);
      return updated;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const isAddressValid = () => {
    return formData.email && formData.name && formData.lastName && formData.phone && formData.address && formData.postalCode && formData.city;
  };

  const handleSubmit = () => {
    if (step === 'address') {
      if (isAddressValid()) {
        setStep('confirmation');
      } else {
        alert('Proszę wypełnić wszystkie wymagane pola.');
      }
    } else if (step === 'confirmation') {
      // Load upsell products and go to upsell step
      loadUpsellProducts();
      setStep('upsell');
    } else if (step === 'upsell') {
      // Complete the order with any selected upsells
      completeOrder();
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Twój koszyk jest pusty</h1>
          <p className="text-gray-500 mb-6">Dodaj produkty przed finalizacją zamówienia</p>
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

  // Order Complete Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-4 py-4 text-center">
            <Link href="/" className="inline-block">
              <div className="flex flex-col items-center">
                <span className="text-[8px] tracking-[0.3em] text-gray-400 font-light">1982</span>
                <span className="text-lg font-light tracking-[0.15em] text-black" style={{ fontFamily: 'Georgia, serif' }}>SORELLE</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Zamówienie Potwierdzone!</h1>
            <p className="text-gray-600 mb-4">
              Dziękujemy za zakupy, {formData.name}!
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Numer zamówienia</p>
              <p className="text-xl font-bold text-black">#{orderNumber}</p>
            </div>

            {/* Payment on Delivery Badge */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-bold">Płatność przy odbiorze</span>
              </div>
              <p className="text-sm text-amber-700 mt-2">
                Zapłacisz kurierowi {total.toFixed(2).replace('.', ',')} zł przy dostawie
              </p>
            </div>

            <div className="text-sm text-gray-600 mb-6 text-left space-y-2">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Potwierdzenie wysłane na {formData.email}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Przewidywana dostawa: 3-5 dni roboczych
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Adres: {formData.address}, {formData.postalCode} {formData.city}
              </p>
            </div>

            <Link
              href="/"
              className="block w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Powrót do sklepu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'address') {
                router.push('/carrinho');
              } else if (step === 'confirmation') {
                setStep('address');
              } else if (step === 'upsell') {
                setStep('confirmation');
              }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Zamówienie</h1>
          <div className="w-5"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center pb-3 px-4">
          <div className="flex items-center gap-1 text-xs">
            {/* Step 1: Koszyk */}
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px]">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-500 hidden sm:inline">Koszyk</span>
            </div>
            <div className="w-4 h-px bg-gray-300"></div>
            {/* Step 2: Dane */}
            <div className="flex items-center gap-1">
              <div className={`w-5 h-5 ${step !== 'address' ? 'bg-green-500' : 'bg-black'} text-white rounded-full flex items-center justify-center text-[10px]`}>
                {step !== 'address' ? (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : '2'}
              </div>
              <span className={step === 'address' ? 'font-medium text-black' : 'text-gray-500'}>Dane</span>
            </div>
            <div className="w-4 h-px bg-gray-300"></div>
            {/* Step 3: Potwierdzenie */}
            <div className="flex items-center gap-1">
              <div className={`w-5 h-5 ${step === 'upsell' ? 'bg-green-500' : step === 'confirmation' ? 'bg-black' : 'bg-gray-200'} ${step === 'confirmation' || step === 'upsell' ? 'text-white' : 'text-gray-500'} rounded-full flex items-center justify-center text-[10px]`}>
                {step === 'upsell' ? (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : '3'}
              </div>
              <span className={step === 'confirmation' ? 'font-medium text-black' : 'text-gray-500'}>Potwierdzenie</span>
            </div>
            <div className="w-4 h-px bg-gray-300"></div>
            {/* Step 4: Oferta */}
            <div className="flex items-center gap-1">
              <div className={`w-5 h-5 ${step === 'upsell' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center text-[10px]`}>
                4
              </div>
              <span className={step === 'upsell' ? 'font-medium text-black' : 'text-gray-500'}>Oferta</span>
            </div>
          </div>
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

      {/* Order Summary Card */}
      <div className="bg-white mt-2 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">Podsumowanie ({cartItems.length} {cartItems.length === 1 ? 'produkt' : cartItems.length < 5 ? 'produkty' : 'produktów'})</h3>
          <button className="text-sm text-black underline">Zobacz szczegóły</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {cartItems.map((item) => (
            <div key={item.id} className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.description} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm text-gray-600 mt-3 pt-3 border-t">
          <span>Razem</span>
          <span className="font-bold text-black">{total.toFixed(2).replace('.', ',')} zł</span>
        </div>
      </div>

      {/* Address Form */}
      {step === 'address' && (
        <div className="bg-white mt-2 p-4">
          <h2 className="font-bold text-gray-800 mb-4">Dane do wysyłki</h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="twoj@email.pl"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imię *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jan"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Kowalski"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
              <div className="flex gap-2">
                <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600 flex-shrink-0">
                  +48
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="123 456 789"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Kurier zadzwoni przed dostawą</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="ul. Przykładowa 123, m. 45"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            {/* Postal Code & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kod pocztowy *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="00-000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Miasto *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Warszawa"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            {/* Voivodeship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Województwo</label>
              <select
                name="voivodeship"
                value={formData.voivodeship}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black bg-white"
              >
                {voivodeships.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uwagi do zamówienia (opcjonalnie)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Np. kod do domofonu, piętro, godziny dostawy..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black resize-none"
              />
            </div>

            {/* Save Address */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm text-gray-700">Zapisz adres na przyszłe zakupy</span>
            </label>
          </div>
        </div>
      )}

      {/* Confirmation Step */}
      {step === 'confirmation' && (
        <>
          {/* Delivery Address Summary */}
          <div className="bg-white mt-2 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">Adres dostawy</h3>
              <button
                onClick={() => setStep('address')}
                className="text-sm text-black underline"
              >
                Zmień
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-black">{formData.name} {formData.lastName}</p>
              <p>{formData.address}</p>
              <p>{formData.postalCode} {formData.city}</p>
              <p>{formData.voivodeship}</p>
              <p className="mt-1">Tel: +48 {formData.phone}</p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white mt-2 p-4">
            <h3 className="font-bold text-gray-800 mb-3">Dostawa</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Dostawa kurierska</p>
                <p className="text-sm text-gray-500">3-5 dni roboczych</p>
              </div>
              <span className={shippingCost === 0 ? 'text-green-600 font-bold' : 'font-bold'}>
                {shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2).replace('.', ',')} zł`}
              </span>
            </div>
          </div>

          {/* Payment Method - Cash on Delivery Only */}
          <div className="bg-white mt-2 p-4">
            <h3 className="font-bold text-gray-800 mb-3">Metoda płatności</h3>

            <div className="p-4 rounded-lg border-2 border-amber-500 bg-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-amber-800">Płatność przy odbiorze</p>
                  <p className="text-sm text-amber-700">Zapłać gotówką lub kartą kurierowi przy dostawie</p>
                </div>
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">100% Bezpieczne zakupy</p>
                  <p className="text-xs text-green-700">Sprawdź paczkę przed zapłatą</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Upsell Step */}
      {step === 'upsell' && (
        <div className="bg-white mt-2 p-4">
          {/* Timer/Urgency Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">Specjalna oferta dla Ciebie!</p>
                <p className="text-white/80 text-sm">Dodaj produkty do zamówienia z rabatem</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-4 text-center">
            Uzupełnij swój zestaw pościeli
          </h3>

          {/* Upsell Products */}
          <div className="space-y-3">
            {upsellItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleUpsellItem(item.id)}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                  item.selected
                    ? 'border-2 border-amber-500 bg-amber-50'
                    : 'border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Checkbox */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.selected ? 'bg-amber-500' : 'border-2 border-gray-300'
                }`}>
                  {item.selected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.description} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200"></div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-black">{item.price.toFixed(2).replace('.', ',')} zł</span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">{item.originalPrice.toFixed(2).replace('.', ',')} zł</span>
                    )}
                  </div>
                </div>

                {/* Add Badge */}
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ${
                  item.selected ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.selected ? 'Dodano' : 'Dodaj'}
                </div>
              </div>
            ))}
          </div>

          {/* Upsell Summary */}
          {upsellTotal > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">Dodatkowe produkty:</span>
                <span className="font-bold text-green-800">+{upsellTotal.toFixed(2).replace('.', ',')} zł</span>
              </div>
            </div>
          )}

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button
              onClick={completeOrder}
              className="text-gray-500 text-sm underline hover:text-gray-700"
            >
              Pomiń i zakończ zamówienie
            </button>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="bg-white mt-2 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <svg className="w-6 h-6 mx-auto text-amber-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p className="text-xs text-gray-600 font-medium">Płatność przy odbiorze</p>
          </div>
          <div>
            <svg className="w-6 h-6 mx-auto text-amber-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            <p className="text-xs text-gray-600 font-medium">30 Dni na zwrot</p>
          </div>
          <div>
            <svg className="w-6 h-6 mx-auto text-amber-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            <p className="text-xs text-gray-600 font-medium">Szybka dostawa</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-40">
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
          <div className="flex justify-between text-sm text-gray-600">
            <span>Dostawa</span>
            <span>{shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2).replace('.', ',')} zł`}</span>
          </div>
          {/* Upsell Total */}
          {upsellTotal > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium mt-1">
              <span>Dodatkowe produkty</span>
              <span>+{upsellTotal.toFixed(2).replace('.', ',')} zł</span>
            </div>
          )}
        </div>

        {/* Total & CTA */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Do zapłaty przy odbiorze</p>
            <p className="text-2xl font-bold text-black">{total.toFixed(2).replace('.', ',')} zł</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`font-bold px-6 py-4 rounded-xl transition-colors flex items-center gap-2 ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Przetwarzanie...
              </>
            ) : (
              step === 'address' ? 'DALEJ' : step === 'confirmation' ? 'DALEJ' : 'ZAMÓW - ZAPŁAĆ PRZY ODBIORZE'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
