import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import PromoBanner from "@/components/PromoBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sorelle | Pościel i Tekstylia Domowe",
  description: "Najlepsza pościel i tekstylia domowe. Produkty najwyższej jakości dla Twojego domu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Utimify Pixel */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
            window.pixelId = "693b953644501a2491aa9c18";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `}
        </Script>
        {/* Utimify UTM Tracking Script */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        <PromoBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
