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
                Mais Vendidos
              </h2>
              <p className="text-neutral-500">
                Os favoritos dos nossos clientes
              </p>
            </div>
            <Link
              href="/cama"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-black hover:text-amber-500 transition-colors"
            >
              Ver todos
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
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link
              href="/cama"
              className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-neutral-800 transition-colors"
            >
              Ver todos os produtos
            </Link>
          </div>
        </div>
      </section>

      <Inspirations />

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Receba as novidades
          </h2>
          <p className="text-white/60 mb-8">
            Inscreva-se para receber ofertas exclusivas e novidades em primeira mão.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="O seu email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-500 transition-colors"
            >
              Subscrever
            </button>
          </form>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-neutral-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-black mb-6">
            Loja Gêmeos
          </h2>
          <div className="text-neutral-600 space-y-4">
            <p>
              Na Loja Gêmeos, acreditamos que o seu descanso merece o melhor. Especializados em roupa de cama premium, oferecemos uma seleção cuidada de capas de edredon, lençóis, fronhas e conjuntos completos.
            </p>
            <p>
              Cada produto é pensado para combinar conforto, durabilidade e estilo. Descubra a nossa coleção de tecidos premium em algodão, linho lavado e flanela.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
