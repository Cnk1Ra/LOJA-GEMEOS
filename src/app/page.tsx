'use client';

import { useState, useEffect } from 'react';
import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import Inspirations from "@/components/Inspirations";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <Categories />
      <Inspirations />

      {/* Brand Section */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Inspiracje od Sorelle
        </h2>

        <div className="flex flex-col gap-4">
          {/* Promo Card 1 */}
          <div className="relative overflow-hidden rounded-2xl min-h-[350px] bg-gradient-to-br from-emerald-800 to-emerald-950">
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Komfort dla Twojego domu
              </h3>
              <p className="text-white/90 text-sm">
                Odkryj nasze pomysły na prezenty
              </p>
              <div className="mt-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="relative overflow-hidden rounded-2xl min-h-[350px] bg-gradient-to-br from-rose-800 to-rose-950">
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Nakrycie stołu
              </h3>
              <p className="text-white/90 text-sm">
                Udekoruj stół na święta
              </p>
              <div className="mt-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-8 px-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Luksusowa Pościel Premium
        </h2>
        <div className="text-gray-600 space-y-4">
          <p>
            W Sorelle wierzymy w coś prostego: Twoja codzienność zasługuje na więcej komfortu, wygody i przede wszystkim stylu. Nasza obietnica? Oferujemy produkty stworzone, aby uprościć Twoje życie i sprawić, że Twój dom będzie jeszcze bardziej przytulny.
          </p>
          <p>
            Sorelle towarzyszy polskim domom z produktami najwyższej jakości od 1982 roku. <strong>Pościel</strong>, <strong>ręczniki kąpielowe</strong> czy <strong>akcesoria stołowe</strong>: każdy produkt, który wybierzesz, ma znaczenie. Musi być użyteczny, piękny, trwały i łatwy do wkomponowania w każdą przestrzeń.
          </p>
          <p>
            Odnawiasz sypialnię? Szukasz rozwiązania do łazienki? Odkryj nasze miękkie ręczniki, wysokiej jakości bawełniane prześcieradła i zestawy stołowe łączące elegancję z praktycznością.
          </p>
        </div>
      </section>

      {/* Scroll to Top Button - Only on Homepage */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-amber-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-400 transition-colors z-50"
          aria-label="Przewiń do góry"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
