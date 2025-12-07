import Link from 'next/link';

const inspirations = [
  {
    id: 1,
    title: 'Roupa de cama',
    subtitle: 'O seu quarto, o seu conforto',
    href: '/cama',
    bgGradient: 'from-blue-400 to-blue-600',
    bgImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: 'Banho elegante',
    subtitle: 'Descubra todos os modelos',
    href: '/banho',
    bgGradient: 'from-teal-400 to-teal-600',
    bgImage: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  },
  {
    id: 3,
    title: 'Mesa de festa',
    subtitle: 'Decore a mesa para ocasiões especiais',
    href: '/mesa',
    bgGradient: 'from-amber-400 to-orange-600',
    bgImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
];

export default function Inspirations() {
  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inspirações</h2>

      <div className="flex flex-col gap-4">
        {inspirations.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative overflow-hidden rounded-2xl min-h-[300px] md:min-h-[400px]"
          >
            {/* Background Gradient */}
            <div
              className="absolute inset-0 transition-transform group-hover:scale-105"
              style={{ background: item.bgImage }}
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base">
                    {item.subtitle}
                  </p>
                </div>

                {/* Arrow Button */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
