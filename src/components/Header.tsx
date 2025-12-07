'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Navigation */}
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
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-[#e91e63]">LOJA</span>
            <br />
            <span className="text-[#e91e63]">GÊMEOS</span>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link href="/cama" className="font-semibold text-gray-800 hover:text-[#0d6b6e] transition-colors">
            CAMA
          </Link>
          <Link href="/mesa" className="font-semibold text-gray-800 hover:text-[#0d6b6e] transition-colors">
            MESA
          </Link>
          <Link href="/banho" className="font-semibold text-gray-800 hover:text-[#0d6b6e] transition-colors">
            BANHO
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Account */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Conta">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Cart */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" aria-label="Carrinho">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#e91e63] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
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
            placeholder="O que procura?"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0d6b6e] transition-all"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t md:hidden">
          <nav className="flex flex-col py-2">
            <Link
              href="/cama"
              className="px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#0d6b6e] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              CAMA
            </Link>
            <Link
              href="/mesa"
              className="px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#0d6b6e] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              MESA
            </Link>
            <Link
              href="/banho"
              className="px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#0d6b6e] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              BANHO
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
