'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('lojaGemeosCart') || '[]');
      const count = cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    // Check cart count periodically
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black">
      {/* Main Navigation */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
          aria-label="Menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo - SORELLE */}
        <Link href="/" className="flex flex-col items-center">
          <span className="text-[10px] tracking-[0.3em] text-white/60 font-light">1982</span>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-white" style={{ fontFamily: 'Georgia, serif' }}>
            SORELLE
          </h1>
          <div className="w-24 h-[1px] bg-amber-500 my-1"></div>
          <span className="text-[8px] tracking-[0.25em] text-white/50 font-light">LUXURY BEDDING</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 top-full bg-black py-2">
          <Link href="/cama" className="text-xs font-light text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            Roupa de Cama
          </Link>
          <Link href="/cama?subcategoria=Capas%20de%20Edredon" className="text-xs font-light text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            Edredons
          </Link>
          <Link href="/cama?subcategoria=Len%C3%A7%C3%B3is" className="text-xs font-light text-white/70 hover:text-white transition-colors uppercase tracking-widest">
            Lençóis
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors" aria-label="Pesquisar">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Account */}
          <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors" aria-label="Conta">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Cart */}
          <Link href="/carrinho" className="p-2.5 hover:bg-white/10 rounded-full transition-colors relative" aria-label="Carrinho">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-white/10 md:hidden">
          <nav className="flex flex-col py-2">
            <Link
              href="/cama"
              className="px-6 py-4 font-light text-white/80 hover:bg-white/5 hover:text-white transition-colors tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Roupa de Cama
            </Link>
            <Link
              href="/cama?subcategoria=Capas%20de%20Edredon"
              className="px-6 py-4 font-light text-white/60 hover:bg-white/5 hover:text-white transition-colors tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Edredons
            </Link>
            <Link
              href="/cama?subcategoria=Len%C3%A7%C3%B3is"
              className="px-6 py-4 font-light text-white/60 hover:bg-white/5 hover:text-white transition-colors tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Lençóis
            </Link>
            <Link
              href="/cama?subcategoria=Fronhas"
              className="px-6 py-4 font-light text-white/60 hover:bg-white/5 hover:text-white transition-colors tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Fronhas
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
