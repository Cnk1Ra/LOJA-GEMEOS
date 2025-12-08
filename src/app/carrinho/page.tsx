'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const cartItems = [
  {
    id: '1',
    name: 'LOJA GÊMEOS',
    description: 'Capa de edredon em algodão e linho lavado, Alanis',
    color: 'Estampado',
    size: '140 x 200 cm (Cama 90/100 cm)',
    ref: '3880554',
    price: 39.67,
    originalPrice: 63.99,
    quantity: 1,
    delivery: 'Entrega prevista em 5 dias',
    image: '/placeholder.jpg'
  }
];

const upsellProducts = [
  {
    id: 'u1',
    name: 'LOJA GÊMEOS',
    description: 'Fronha de almofada em algodão e linho lavado, Alanis',
    price: 8.33,
    originalPrice: 16.99,
    discount: 51,
    rating: 4.7,
    colors: ['#4a90d9', '#ffffff'],
    badge: 'Promoção',
    href: '/produto/u1'
  },
  {
    id: 'u2',
    name: 'LOJA GÊMEOS',
    description: 'Fronha de almofada lisa em algodão',
    price: 4.80,
    originalPrice: 9.99,
    discount: 52,
    rating: 4.3,
    colors: ['#ffffff', '#f5f5dc'],
    badge: 'Promoção',
    href: '/produto/u2'
  },
];

const recentlyViewed = [
  {
    id: 'rv1',
    name: 'LOJA GÊMEOS',
    description: 'Capa de edredon em algodão, Scenario',
    price: 35.67,
    originalPrice: 59.99,
    discount: 41,
    rating: 3.6,
    badge: 'Promoção',
    href: '/produto/rv1'
  },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [promoCode, setPromoCode] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const savings = originalTotal - subtotal;

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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Breadcrumb Steps */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-center py-4 px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[black] text-white rounded-full flex items-center justify-center text-sm font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[black]">Carrinho</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Endereço</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Pagamento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="bg-white px-4 py-3 border-b">
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[black]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Continuar as minhas compras
        </Link>
      </div>

      {/* Cart Header */}
      <div className="bg-white px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Carrinho ({items.length})</h1>

        {/* Free Shipping Toggle */}
        <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[black]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="text-sm font-medium">Entrega grátis ilimitada</span>
          </div>
          <button
            onClick={() => setFreeShipping(!freeShipping)}
            className={`w-12 h-6 rounded-full transition-colors ${freeShipping ? 'bg-[black]' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${freeShipping ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </button>
        </div>

        <button className="text-sm text-[black] underline mt-2">
          Ver termos e condições
        </button>
      </div>

      {/* Cart Items */}
      <div className="bg-white mt-2 px-4 py-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
            {/* Product Image */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg"></div>
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
                <p>Cor: {item.color}</p>
                <p>{item.size}</p>
                <p>Ref: {item.ref}</p>
              </div>

              {/* Price */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="line-through text-gray-400 text-sm">
                    {item.originalPrice.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="text-lg font-bold text-[black]">
                    {item.price.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <p className="text-xs text-green-600">Poupou {(item.originalPrice - item.price).toFixed(2).replace('.', ',')} €</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-3 text-xs">
                <button className="text-gray-600 hover:text-[black]">Guardar nos favoritos</button>
                <button className="text-gray-600 hover:text-[black]">Modificar</button>
                <button onClick={() => removeItem(item.id)} className="text-[black]">Remover</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="bg-white mt-2 px-4 py-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Código promocional</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Inserir código"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[black]"
          />
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
            OK
          </button>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white mt-2 px-4 py-4 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
          <span className="font-bold text-pink-500">Klarna</span>
          <span className="text-sm text-gray-600">3 pagamentos de {(subtotal / 3).toFixed(2).replace('.', ',')} € sem juros</span>
          <button className="text-sm text-pink-500 underline ml-auto">Saber mais</button>
        </div>

        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm text-gray-700">Devoluções grátis</span>
          <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-sm text-gray-700">Entrega grátis em ponto Pickup</span>
          <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Upsell Section */}
      <div className="bg-white mt-2 px-4 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Nossos clientes também gostaram</h2>
        <div className="grid grid-cols-2 gap-4">
          {upsellProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="bg-white mt-2 px-4 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Últimos artigos vistos</h2>
        <div className="grid grid-cols-2 gap-4">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white mt-2 px-4 py-6 border-t">
        <div className="text-center">
          <h3 className="font-bold text-gray-800">Oferta de 10€ na sua compra!</h3>
          <p className="text-sm text-gray-500 mt-1">Indique o seu e-mail</p>
          <input
            type="email"
            placeholder="exemplo@email.com"
            className="mt-3 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[black]"
          />
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-800">{subtotal.toFixed(2).replace('.', ',')} €</p>
          </div>
          <Link
            href="/checkout"
            className="bg-[black] text-white font-bold px-8 py-3 rounded-lg hover:bg-[neutral-800] transition-colors"
          >
            CONFIRMAR ENCOMENDA
          </Link>
        </div>
      </div>
    </div>
  );
}
