'use client';

interface Subcategory {
  id: string;
  name: string;
  image?: string;
  bgColor?: string;
}

interface CategoryFilterProps {
  subcategories?: Subcategory[];
  totalProducts: number;
  activeSubcategory: string | null;
  onSubcategoryChange: (subcategory: string | null) => void;
}

export default function CategoryFilter({
  subcategories = [],
  totalProducts,
  activeSubcategory,
  onSubcategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      {/* Subcategories Scroll - Horizontal Pills */}
      {subcategories.length > 0 && (
        <div className="relative -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSubcategoryChange(activeSubcategory === sub.name ? null : sub.name)}
                className={`flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border bg-white whitespace-nowrap transition-all flex-shrink-0 ${
                  activeSubcategory === sub.name
                    ? 'border-black shadow-md bg-black/5'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Category Image */}
                <div
                  className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: sub.bgColor || '#f3f4f6' }}
                >
                  {sub.image ? (
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-white/30 rounded"></div>
                  )}
                </div>
                <span className={`text-sm font-medium pr-1 ${activeSubcategory === sub.name ? 'text-black' : 'text-gray-800'}`}>
                  {sub.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Count */}
      <p className="text-sm text-gray-500">
        {totalProducts} {totalProducts === 1 ? 'produkt' : 'produktów'}
        {activeSubcategory && <span className="text-black font-medium"> w kategorii {activeSubcategory}</span>}
      </p>
    </div>
  );
}
