import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Roupa de Cama',
    description: 'Lençóis, edredons e almofadas',
    href: '/cama',
    bgColor: 'bg-[#f5f0e6]',
    icon: (
      <svg className="w-24 h-24 text-[#8b7355]" viewBox="0 0 100 100" fill="currentColor">
        <rect x="15" y="40" width="70" height="40" rx="5" />
        <rect x="20" y="30" width="60" height="15" rx="3" />
        <rect x="25" y="20" width="50" height="15" rx="3" />
        <circle cx="35" cy="35" r="8" />
        <circle cx="65" cy="35" r="8" />
      </svg>
    )
  },
  {
    id: 2,
    name: 'Toalhas de Banho',
    description: 'Macias e absorventes',
    href: '/banho',
    bgColor: 'bg-[#e8f4f8]',
    icon: (
      <svg className="w-24 h-24 text-[#4a90a4]" viewBox="0 0 100 100" fill="currentColor">
        <rect x="20" y="20" width="60" height="70" rx="5" />
        <rect x="30" y="30" width="40" height="10" rx="2" />
        <rect x="30" y="50" width="40" height="10" rx="2" />
        <rect x="30" y="70" width="40" height="10" rx="2" />
      </svg>
    )
  },
  {
    id: 3,
    name: 'Mesa e Cozinha',
    description: 'Toalhas e acessórios',
    href: '/mesa',
    bgColor: 'bg-[#fff5e6]',
    icon: (
      <svg className="w-24 h-24 text-[#c4956a]" viewBox="0 0 100 100" fill="currentColor">
        <ellipse cx="50" cy="60" rx="35" ry="8" />
        <rect x="15" y="55" width="70" height="25" rx="3" />
        <rect x="45" y="30" width="10" height="30" />
        <circle cx="50" cy="25" r="15" />
      </svg>
    )
  },
  {
    id: 4,
    name: 'Tapetes',
    description: 'Para todos os ambientes',
    href: '/tapetes',
    bgColor: 'bg-[#f0e6f5]',
    icon: (
      <svg className="w-24 h-24 text-[#8b6b95]" viewBox="0 0 100 100" fill="currentColor">
        <rect x="10" y="30" width="80" height="50" rx="3" />
        <line x1="20" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="3" />
        <line x1="20" y1="55" x2="80" y2="55" stroke="currentColor" strokeWidth="3" />
        <line x1="20" y1="70" x2="80" y2="70" stroke="currentColor" strokeWidth="3" />
      </svg>
    )
  }
];

export default function Categories() {
  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quer ver mais artigos?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Featured Category - Full Width */}
        <Link
          href={categories[0].href}
          className="col-span-1 md:col-span-2 group"
        >
          <div className={`${categories[0].bgColor} rounded-2xl p-8 flex flex-col items-center justify-center min-h-[250px] transition-transform group-hover:scale-[1.02]`}>
            {categories[0].icon}
            <h3 className="text-xl font-semibold text-gray-800 mt-4">{categories[0].name}</h3>
          </div>
        </Link>

        {/* Other Categories - 2 columns */}
        {categories.slice(1).map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group"
          >
            <div className={`${category.bgColor} rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] transition-transform group-hover:scale-[1.02]`}>
              {category.icon}
              <h3 className="text-lg font-semibold text-gray-800 mt-4">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
