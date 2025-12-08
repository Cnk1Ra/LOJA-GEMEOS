'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('lojaGemeosCart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    // Check cart count every second (for same-tab updates)
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-amber-900 text-white text-center text-xs py-1.5 px-4">
        Darmowa dostawa od 200 zł | 30 dni na zwrot
      </div>

      {/* Main Navigation */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center">
          <span className="text-[8px] tracking-[0.3em] text-gray-400 font-light">1982</span>
          <span className="text-xl font-light tracking-[0.15em] text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>SORELLE</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link href="/cama" className="font-medium text-gray-800 hover:text-amber-700 transition-colors">
            POŚCIEL
          </Link>
          <Link href="/mesa" className="font-medium text-gray-800 hover:text-amber-700 transition-colors">
            STÓŁ
          </Link>
          <Link href="/banho" className="font-medium text-gray-800 hover:text-amber-700 transition-colors">
            ŁAZIENKA
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Account */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Konto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Cart */}
          <Link href="/carrinho" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" aria-label="Koszyk">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Czego szukasz?"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t md:hidden">
          <nav className="flex flex-col py-2">
            <Link
              href="/cama"
              className="px-6 py-3 font-medium text-gray-800 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              POŚCIEL
            </Link>
            <Link
              href="/mesa"
              className="px-6 py-3 font-medium text-gray-800 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              STÓŁ
            </Link>
            <Link
              href="/banho"
              className="px-6 py-3 font-medium text-gray-800 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ŁAZIENKA
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
