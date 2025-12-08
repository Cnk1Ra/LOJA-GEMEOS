'use client';

import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Full Width Banner Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/christmas-banner.jpg"
          alt="Christmas, Passionately - Decoração de Natal"
          className="w-full h-full object-cover object-center"
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

        {/* CTA Button */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
          <Link
            href="/cama"
            className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-amber-500 transition-colors shadow-lg"
          >
            Ver Coleção de Natal
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
