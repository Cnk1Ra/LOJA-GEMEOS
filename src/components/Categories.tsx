'use client';

import Link from 'next/link';
import { products } from '@/data/products';

// Get a sample product image for each subcategory
const getSubcategoryImage = (subcategory: string): string => {
  const product = products.find(p => p.subcategory === subcategory);
  return product?.image || '';
};

export default function Categories() {
  // Main categories with larger cards
  const mainCategories = [
    { name: 'Pościel na kołdrę' },
    { name: 'Prześcieradła z gumką' },
    { name: 'Prześcieradła' },
    { name: 'Poszewki' },
  ];

  return (
    <section className="py-12 px-4 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-3">
            Przeglądaj Kategorie
          </h2>
          <p className="text-neutral-500 text-lg">
            Znajdź idealny komfort dla swojej sypialni
          </p>
        </div>

        {/* Main Categories - Large Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {mainCategories.map((category) => {
            const image = getSubcategoryImage(category.name);
            return (
              <Link
                key={category.name}
                href={`/cama?subcategoria=${encodeURIComponent(category.name)}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-black"
              >
                {/* Background Image */}
                {image && (
                  <img
                    src={image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <h3 className="text-white text-lg md:text-xl font-bold leading-tight">
                    {category.name}
                  </h3>

                  {/* Arrow */}
                  <div className="mt-3 w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
