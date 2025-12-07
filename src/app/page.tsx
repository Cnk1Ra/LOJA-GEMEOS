import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import Inspirations from "@/components/Inspirations";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <Categories />
      <Inspirations />

      {/* Brand Section */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          As ideias inspiradoras das nossas marcas
        </h2>

        <div className="flex flex-col gap-4">
          {/* Promo Card 1 */}
          <div className="relative overflow-hidden rounded-2xl min-h-[350px] bg-gradient-to-br from-emerald-800 to-emerald-950">
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Conforto para sua casa
              </h3>
              <p className="text-white/90 text-sm">
                Descubra as nossas ideias-presentes
              </p>
              <div className="mt-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="relative overflow-hidden rounded-2xl min-h-[350px] bg-gradient-to-br from-rose-800 to-rose-950">
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Mesa posta
              </h3>
              <p className="text-white/90 text-sm">
                Decore a mesa para as festas
              </p>
              <div className="mt-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-8 px-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cama, Mesa e Banho
        </h2>
        <div className="text-gray-600 space-y-4">
          <p>
            Na Loja Gêmeos, acreditamos em algo simples: o seu dia a dia merece mais conforto, mais praticidade e, acima de tudo, mais estilo. A nossa promessa? Oferecer-lhe produtos pensados para simplificar a sua vida e deixar a sua casa ainda mais aconchegante.
          </p>
          <p>
            A Loja Gêmeos acompanha os lares brasileiros com produtos de qualidade. <strong>Roupa de cama</strong>, <strong>toalhas de banho</strong> ou <strong>acessórios para mesa</strong>: cada produto que escolhe tem significado. Deve ser útil, bonito, duradouro e fácil de integrar em qualquer espaço.
          </p>
          <p>
            Está a renovar o quarto? Procura uma solução para o banheiro? Descubra as nossas toalhas macias, os lençóis de algodão de alta qualidade, e os conjuntos de mesa que combinam elegância e praticidade.
          </p>
        </div>
      </section>
    </div>
  );
}
