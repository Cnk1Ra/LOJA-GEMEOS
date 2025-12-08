import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative">
      {/* Main Banner */}
      <div className="relative h-[450px] md:h-[550px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12">
          <div className="max-w-lg">
            {/* Badge */}
            <span className="inline-block bg-white/90 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              Od 01/12 do 08/12
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
              ZIMOWA
              <br />
              PROMOCJA
            </h1>

            {/* Discount */}
            <p className="text-5xl md:text-6xl font-black text-amber-400 mb-6">
              DO -60%
            </p>

            {/* Description */}
            <p className="text-white/90 text-sm md:text-base mb-6 max-w-sm">
              Odkryj naszą kolekcję luksusowej pościeli premium. Najwyższa jakość w najlepszych cenach.
            </p>

            {/* CTA Button */}
            <Link
              href="/promocje"
              className="inline-flex items-center gap-2 bg-amber-500 text-black font-bold px-8 py-4 rounded-full hover:bg-amber-400 transition-all hover:scale-105 shadow-lg"
            >
              Sprawdź ofertę
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Feature Strip */}
      <div className="bg-amber-50 border-y border-amber-200">
        <div className="flex items-center justify-around py-4 px-4 text-center">
          <div className="flex flex-col items-center">
            <svg className="w-6 h-6 text-amber-700 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            <span className="text-xs font-medium text-amber-900">Darmowa dostawa</span>
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-6 h-6 text-amber-700 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs font-medium text-amber-900">Płatność przy odbiorze</span>
          </div>
          <div className="flex flex-col items-center">
            <svg className="w-6 h-6 text-amber-700 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            <span className="text-xs font-medium text-amber-900">30 dni na zwrot</span>
          </div>
        </div>
      </div>
    </section>
  );
}
