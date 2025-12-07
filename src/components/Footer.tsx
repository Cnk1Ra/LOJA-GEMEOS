'use client';

import { useState } from 'react';
import Link from 'next/link';

const footerSections = [
  {
    title: 'LOJA GÊMEOS',
    links: [
      { name: 'Quem somos', href: '/sobre' },
      { name: 'Nossas lojas', href: '/lojas' },
      { name: 'Trabalhe conosco', href: '/carreiras' },
      { name: 'Blog', href: '/blog' }
    ]
  },
  {
    title: 'SERVIÇOS',
    links: [
      { name: 'Ajuda', href: '/ajuda' },
      { name: 'Minha conta', href: '/conta' },
      { name: 'Acompanhar pedido', href: '/pedidos' },
      { name: 'Cartão presente', href: '/cartao-presente' }
    ]
  },
  {
    title: 'CATEGORIAS',
    links: [
      { name: 'Cama', href: '/cama' },
      { name: 'Mesa', href: '/mesa' },
      { name: 'Banho', href: '/banho' },
      { name: 'Tapetes', href: '/tapetes' }
    ]
  }
];

const serviceIcons = [
  {
    title: 'ENTREGA',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  },
  {
    title: 'TROCAS & DEVOLUÇÕES',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    title: 'PAGAMENTO SEGURO',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    title: 'APOIO AO CLIENTE',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

const paymentMethods = ['VISA', 'MC', 'PIX', 'BOLETO'];

const socialLinks = [
  { name: 'Facebook', icon: 'f' },
  { name: 'Instagram', icon: 'ig' },
  { name: 'Pinterest', icon: 'p' },
  { name: 'YouTube', icon: 'yt' }
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="bg-[#0d6b6e] text-white">
      {/* Service Icons */}
      <div className="px-4 py-8 border-b border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {serviceIcons.map((service) => (
            <div key={service.title} className="flex items-center gap-3">
              <div className="text-white">
                {service.icon}
              </div>
              <span className="text-sm font-semibold">{service.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="px-4 py-4">
        {footerSections.map((section) => (
          <div key={section.title} className="border-b border-white/20">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full py-4 flex items-center justify-between text-left"
            >
              <span className="font-semibold">{section.title}</span>
              <svg
                className={`w-5 h-5 transition-transform ${openSection === section.title ? 'rotate-45' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {openSection === section.title && (
              <div className="pb-4 space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-white/80 hover:text-white transition-colors py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div className="px-4 py-6 border-t border-white/20">
        <h3 className="font-semibold mb-4">SEMPRE JUNTOS</h3>
        <div className="flex gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href="#"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label={social.name}
            >
              <span className="text-sm font-bold">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 py-6 border-t border-white/20">
        <h3 className="font-semibold mb-4">MODOS DE PAGAMENTO</h3>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map((method) => (
            <div
              key={method}
              className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-semibold"
            >
              {method}
            </div>
          ))}
        </div>
      </div>

      {/* Legal Links */}
      <div className="px-4 py-6 border-t border-white/20">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
          <Link href="/termos" className="hover:text-white">Termos de uso</Link>
          <span>•</span>
          <Link href="/privacidade" className="hover:text-white">Política de privacidade</Link>
          <span>•</span>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
        </div>
      </div>

      {/* Country Selector */}
      <div className="px-4 py-4 border-t border-white/20">
        <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>Brasil</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Copyright */}
      <div className="px-4 py-4 text-center text-sm text-white/60 border-t border-white/20">
        <p>© 2024 Loja Gêmeos. Todos os direitos reservados.</p>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors z-50"
        aria-label="Voltar ao topo"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}
