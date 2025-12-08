import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative">
      {/* Background with gradient and pattern */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-amber-900">
          {/* Left decorative stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-amber-200 transform -skew-x-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <p className="text-gray-600 mb-2">Od 01/12 do 08/12</p>
          <h1 className="text-4xl md:text-6xl font-black text-amber-900 mb-2">
            ZIMOWA PROMOCJA
          </h1>
          <p className="text-2xl md:text-4xl font-bold text-amber-900 mb-8">
            DO -60%
          </p>

          {/* Product Image Placeholder */}
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-b from-amber-50 to-amber-700 rounded-lg shadow-xl mb-8 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-24 md:w-28 md:h-32 bg-amber-50 rounded-sm mx-auto mb-2"></div>
              <div className="w-12 h-8 md:w-16 md:h-10 bg-amber-700 rounded-full mx-auto"></div>
            </div>
          </div>

          <Link
            href="/promocje"
            className="inline-block bg-white text-gray-800 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Sprawdź ofertę!
          </Link>
        </div>
      </div>
    </section>
  );
}
