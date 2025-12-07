import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative">
      {/* Background with gradient and pattern */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4] via-white to-[#1a1a4e]">
          {/* Left decorative stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#7fffd4] transform -skew-x-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <p className="text-gray-600 mb-2">De 01/12 a 08/12</p>
          <h1 className="text-4xl md:text-6xl font-black text-[#1a1a4e] mb-2">
            CYBER WEEK
          </h1>
          <p className="text-2xl md:text-4xl font-bold text-[#1a1a4e] mb-8">
            ATÉ -60%
          </p>

          {/* Product Image Placeholder */}
          <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-b from-[#f5f0e6] to-[#0d6b6e] rounded-lg shadow-xl mb-8 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-24 md:w-28 md:h-32 bg-[#f5f0e6] rounded-sm mx-auto mb-2"></div>
              <div className="w-12 h-8 md:w-16 md:h-10 bg-[#0d6b6e] rounded-full mx-auto"></div>
            </div>
          </div>

          <Link
            href="/promocoes"
            className="inline-block bg-white text-gray-800 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Aproveitar!
          </Link>
        </div>
      </div>
    </section>
  );
}
