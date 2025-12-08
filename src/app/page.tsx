'use client';

import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import Inspirations from "@/components/Inspirations";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function Home() {
  // Get best selling products (first 8)
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-neutral-50">
      <HeroBanner />
      <Categories />

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black mb-2">
                Najchętniej Kupowane
              </h2>
              <p className="text-neutral-500">
                Ulubione produkty naszych klientów
              </p>
            </div>
            <Link
              href="/cama"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-black hover:text-amber-500 transition-colors"
            >
              Zobacz wszystko
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={159.99}
                originalPrice={259.99}
                discount={38}
                rating={product.rating}
                colors={product.colors}
                moreColors={product.moreColors}
                badge={product.badge}
                href={product.href}
                image={product.image}
              />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link
              href="/cama"
              className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-neutral-800 transition-colors"
            >
              Zobacz wszystkie produkty
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-[#5a5a5a] flex flex-col md:flex-row">
            {/* Left Content */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white italic mb-2">
                PROMOCJE NIE DO
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                PRZEGAPIENIA
              </h2>
              <p className="text-white/80 text-sm md:text-base italic max-w-md">
                Odkryj komfort, który odmienia Twoje noce. Ekskluzywne zestawy pościeli i poszewek o wyjątkowej jakości i wyrafinowanym designie.
              </p>

              {/* Discount Badge */}
              <div className="mt-6 inline-flex">
                <div className="bg-white rounded-full w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center border-4 border-dashed border-gray-300">
                  <span className="text-[10px] md:text-xs text-gray-600 font-medium">SAVE UP TO</span>
                  <span className="text-2xl md:text-3xl font-black text-black">60%</span>
                  <span className="text-xs md:text-sm font-bold text-black">OFF</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative min-h-[250px] md:min-h-[350px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#5a5a5a] via-[#5a5a5a]/50 to-transparent z-10 md:w-1/3"></div>
              <img
                src="https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80"
                alt="Luksusowa pościel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Inspirations />

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Otrzymuj nowości
          </h2>
          <p className="text-white/60 mb-8">
            Zapisz się, aby otrzymywać ekskluzywne oferty i nowości jako pierwsza.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Twój email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-500 transition-colors"
            >
              Zapisz się
            </button>
          </form>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-neutral-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-black mb-6">
            Sorelle
          </h2>
          <div className="text-neutral-600 space-y-4">
            <p>
              W Sorelle wierzymy, że Twój odpoczynek zasługuje na to, co najlepsze. Specjalizujemy się w luksusowej pościeli premium, oferując starannie wyselekcjonowany wybór poszew na kołdrę, prześcieradeł, poszewek i kompletnych zestawów.
            </p>
            <p>
              Każdy produkt jest zaprojektowany tak, aby łączyć komfort, trwałość i styl. Odkryj naszą kolekcję tkanin premium z bawełny, pranego lnu i flaneli.
            </p>
          </div>
        </div>
      </section>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-amber-500 text-black rounded-full shadow-lg flex items-center justify-center hover:bg-amber-400 transition-colors z-50"
        aria-label="Powrót na górę"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
