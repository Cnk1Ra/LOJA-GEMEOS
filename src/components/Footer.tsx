'use client';

import { useState } from 'react';
import Link from 'next/link';

const footerSections = [
  {
    title: 'SORELLE',
    links: [
      { name: 'O nas', href: '/o-nas' },
      { name: 'Nasze sklepy', href: '/sklepy' },
      { name: 'Kariera', href: '/kariera' },
      { name: 'Blog', href: '/blog' }
    ]
  },
  {
    title: 'OBSŁUGA KLIENTA',
    links: [
      { name: 'Pomoc', href: '/pomoc' },
      { name: 'Moje konto', href: '/konto' },
      { name: 'Śledzenie zamówienia', href: '/zamowienia' },
      { name: 'Karta podarunkowa', href: '/karta-podarunkowa' }
    ]
  },
  {
    title: 'KATEGORIE',
    links: [
      { name: 'Pościel', href: '/cama' },
      { name: 'Obrusy', href: '/mesa' },
      { name: 'Ręczniki', href: '/banho' },
      { name: 'Narzuty', href: '/colchas' }
    ]
  }
];

// SVG Icons
const TruckIcon = () => (
  <svg className="w-7 h-7 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

const ReturnIcon = () => (
  <svg className="w-7 h-7 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
);

const CashIcon = () => (
  <svg className="w-7 h-7 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const SupportIcon = () => (
  <svg className="w-7 h-7 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
  </svg>
);

const serviceIcons = [
  { title: 'Darmowa Dostawa', desc: 'Powyżej 200 zł', icon: <TruckIcon /> },
  { title: '30 Dni', desc: 'Na zwrot', icon: <ReturnIcon /> },
  { title: 'Przy odbiorze', desc: 'Bezpieczna płatność', icon: <CashIcon /> },
  { title: 'Pomoc 24/7', desc: 'Wsparcie', icon: <SupportIcon /> }
];

const paymentMethods = ['Przy odbiorze', 'BLIK', 'Przelew'];

const socialLinks = [
  { name: 'Facebook', icon: 'f' },
  { name: 'Instagram', icon: 'ig' },
  { name: 'Pinterest', icon: 'p' }
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Service Icons */}
      <div className="px-4 py-8 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {serviceIcons.map((service) => (
            <div key={service.title} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {service.icon}
              </div>
              <div>
                <span className="text-sm font-semibold block">{service.title}</span>
                <span className="text-xs text-gray-400">{service.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="px-4 py-4">
        {footerSections.map((section) => (
          <div key={section.title} className="border-b border-white/10">
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
      <div className="px-4 py-6 border-t border-white/10">
        <h3 className="font-semibold mb-4">OBSERWUJ NAS</h3>
        <div className="flex gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
              aria-label={social.name}
            >
              <span className="text-sm font-bold">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 py-6 border-t border-white/10">
        <h3 className="font-semibold mb-4">METODY PŁATNOŚCI</h3>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map((method) => (
            <div
              key={method}
              className="bg-white text-gray-800 px-3 py-1.5 rounded text-sm font-semibold"
            >
              {method}
            </div>
          ))}
        </div>
      </div>

      {/* Legal Links */}
      <div className="px-4 py-6 border-t border-white/10">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60">
          <Link href="/regulamin" className="hover:text-white">Regulamin</Link>
          <span>•</span>
          <Link href="/prywatnosc" className="hover:text-white">Polityka prywatności</Link>
          <span>•</span>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
        </div>
      </div>

      {/* Country Selector */}
      <div className="px-4 py-4 border-t border-white/10">
        <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>Polska</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Copyright */}
      <div className="px-4 py-4 text-center text-sm text-white/50 border-t border-white/10">
        <p>© 2024 Sorelle. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
}
