'use client';

import Link from 'next/link';
import { products } from '@/data/products';

export default function Inspirations() {
  // Get products for each inspiration
  const edredonProduct = products.find(p => p.subcategory === 'Capas de Edredon');
  const lencoisProduct = products.find(p => p.subcategory === 'Lençóis');
  const fronhasProduct = products.find(p => p.subcategory === 'Fronhas');

  const inspirations = [
    {
      id: 1,
      title: 'Capas de Edredon',
      subtitle: 'Conforto e estilo para noites perfeitas',
      href: '/cama?subcategoria=Capas%20de%20Edredon',
      image: edredonProduct?.image,
    },
    {
      id: 2,
      title: 'Lençóis Premium',
      subtitle: 'Algodão de alta qualidade',
      href: '/cama?subcategoria=Lençóis',
      image: lencoisProduct?.image,
    },
    {
      id: 3,
      title: 'Fronhas & Almofadas',
      subtitle: 'Complete a decoração do seu quarto',
      href: '/cama?subcategoria=Fronhas',
      image: fronhasProduct?.image,
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-black mb-2">
              Inspirações
            </h2>
            <p className="text-neutral-500">
              Descubra as tendências para o seu quarto
            </p>
          </div>
          <Link
            href="/cama"
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-black hover:text-amber-500 transition-colors"
          >
            Ver tudo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Inspirations Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {inspirations.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative overflow-hidden rounded-3xl ${
                index === 0 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto' : 'aspect-[4/3]'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-neutral-900">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                )}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {item.subtitle}
                </p>

                {/* Button */}
                <div className="flex items-center gap-2 text-amber-500 font-medium text-sm group-hover:gap-4 transition-all">
                  <span>Explorar</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
