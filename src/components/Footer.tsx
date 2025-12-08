'use client';

import Link from 'next/link';

const footerLinks = {
  categories: [
    { name: 'Pościel', href: '/cama?subcategoria=Capas%20de%20Edredon' },
    { name: 'Prześcieradła', href: '/cama?subcategoria=Lençóis' },
    { name: 'Poduszki', href: '/cama?subcategoria=Fronhas' },
    { name: 'Komplety', href: '/cama?subcategoria=Conjuntos' },
  ],
  help: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Dostawa', href: '/entregas' },
    { name: 'Zwroty', href: '/devolucoes' },
    { name: 'Kontakt', href: '/contacto' },
  ],
  company: [
    { name: 'O nas', href: '/sobre' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kariera', href: '/carreiras' },
  ],
};

// SVG Icons as components
const TruckIcon = () => (
  <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

const ReturnIcon = () => (
  <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
);

const LockIcon = () => (
  <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const SupportIcon = () => (
  <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
  </svg>
);

const features = [
  { icon: <TruckIcon />, title: 'Darmowa Dostawa', desc: 'Zamówienia powyżej 200 zł' },
  { icon: <ReturnIcon />, title: '30 Dni', desc: 'Na zwrot' },
  { icon: <LockIcon />, title: 'Płatność przy odbiorze', desc: '100% Bezpieczna' },
  { icon: <SupportIcon />, title: 'Wsparcie', desc: 'Pomoc 24/7' },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Features Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                {feature.icon}
                <div>
                  <p className="font-bold text-sm">{feature.title}</p>
                  <p className="text-white/50 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex flex-col">
                <span className="text-[8px] tracking-[0.3em] text-white/50 font-light">1982</span>
                <span className="text-xl font-light tracking-[0.15em] text-white" style={{ fontFamily: 'Georgia, serif' }}>SORELLE</span>
                <div className="w-16 h-[1px] bg-amber-500 my-1"></div>
                <span className="text-[7px] tracking-[0.2em] text-white/40 font-light">LUXURY BEDDING</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm mb-6">
              Luksusowa pościel najwyższej jakości od 1982 roku.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {['instagram', 'facebook', 'pinterest'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all"
                >
                  <span className="text-xs font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Kategorie</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-amber-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Pomoc</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-amber-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Firma</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-amber-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2024 Sorelle. Wszelkie prawa zastrzeżone.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-xs">Płatność:</span>
              {['Przy odbiorze', 'BLIK', 'Przelew'].map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 bg-white/10 rounded text-xs font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-amber-500 text-black rounded-full shadow-lg flex items-center justify-center hover:bg-amber-400 transition-colors z-50"
        aria-label="Powrót na górę"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}
