'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { products, subcategories, subcategoryCounts } from '@/data/products';

const subcategoryColors: Record<string, string> = {
  'Capas de Edredon': '#e0f2f1',
  'Lençóis-Capa': '#fff8e1',
  'Lençóis': '#e8f5e9',
  'Fronhas': '#fce4ec',
  'Conjuntos': '#e3f2fd',
  'Colchas': '#ffebee',
  'Mantas': '#f3e5f5',
  'Cobertores': '#e1f5fe',
  'Almofadas': '#fff3e0',
  'Protetores': '#f5f5f5',
  'Outros': '#fafafa',
};

export default function CamaPage() {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const subcategoryFilters = subcategories.map((name, index) => ({
    id: (index + 1).toString(),
    name: name,
    bgColor: subcategoryColors[name] || '#f5f5f5',
  }));

  // Filter products based on selected subcategory
  const filteredProducts = useMemo(() => {
    if (!activeSubcategory) {
      return products;
    }
    return products.filter(product => product.subcategory === activeSubcategory);
  }, [activeSubcategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-4 py-3 text-sm text-gray-500">
        <Link href="/" className="hover:text-black">...</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Roupa de cama</span>
      </div>

      {/* Category Title */}
      <div className="px-4 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Roupa de cama</h1>
      </div>

      {/* Subcategories and Filters */}
      <div className="px-4 pb-4">
        <CategoryFilter
          subcategories={subcategoryFilters}
          totalProducts={filteredProducts.length}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={setActiveSubcategory}
        />
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                rating={product.rating}
                colors={product.colors}
                moreColors={product.moreColors}
                badge={product.badge}
                href={product.href}
                image={product.image}
              />

              {/* Promo Card after 3rd product */}
              {index === 2 && !activeSubcategory && (
                <Link
                  href="/promocoes"
                  className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1a1a4e] to-[#2d2d6e] flex flex-col items-center justify-center p-4 text-center mt-4 min-h-[200px]"
                >
                  <p className="text-white/80 text-xs mb-1">De 01/12 a 08/12</p>
                  <h3 className="text-white text-2xl font-black mb-1">CYBER</h3>
                  <h3 className="text-white text-2xl font-black mb-2">WEEK</h3>
                  <p className="text-white text-lg font-bold">ATÉ -60%</p>
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
            <button
              onClick={() => setActiveSubcategory(null)}
              className="mt-4 text-black font-medium hover:underline"
            >
              Ver todos os produtos
            </button>
          </div>
        )}
      </div>

      {/* Load More - only show if there are many products */}
      {filteredProducts.length > 20 && (
        <div className="px-4 pb-8 text-center">
          <button className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:border-gray-400 transition-colors">
            Ver mais produtos
          </button>
        </div>
      )}
    </div>
  );
}
