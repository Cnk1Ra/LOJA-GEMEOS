import type { Metadata } from "next";
import "./globals.css";
import PromoBanner from "@/components/PromoBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Loja Gêmeos | Cama, Mesa e Banho",
  description: "A melhor loja de cama, mesa e banho. Produtos de qualidade para deixar sua casa ainda mais aconchegante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <PromoBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
