'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProductById, getRelatedProducts, products } from '@/data/products';

const sizes = [
  { id: '1', name: '140 x 200 cm (Łóżko 90/100 cm)', originalPrice: 399.90, price: 198.90, shopifyUrl: 'https://lencol-01.myshopify.com/products/poszewka-na-poduszke-z-pranego-lnu-linot' },
  { id: '2', name: '200 x 200 cm (Łóżko 140 cm)', originalPrice: 459.90, price: 228.90, shopifyUrl: 'https://lencol-01.myshopify.com/products/200-200-cm-lozko-140-cm' },
  { id: '3', name: '220 x 240 cm (Łóżko 160 cm)', originalPrice: 519.90, price: 258.90, shopifyUrl: 'https://lencol-01.myshopify.com/products/220-240-cm-lozko-160-cm' },
  { id: '4', name: '260 x 240 cm (Łóżko 180 cm)', originalPrice: 579.90, price: 288.90, shopifyUrl: 'https://lencol-01.myshopify.com/products/260-240-cm-lozko-180-cm' },
];

// Function to get UTM parameters from URL or localStorage
const getUtmParams = (): string => {
  if (typeof window === 'undefined') return '';

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: string[] = [];
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  // First try to get from URL
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  });

  // Fallback to localStorage (Utmify storage)
  if (utmParams.length === 0) {
    try {
      const storedUtms = localStorage.getItem('__utmify_session_utm');
      if (storedUtms) {
        const parsed = JSON.parse(storedUtms);
        utmKeys.forEach(key => {
          if (parsed[key]) {
            utmParams.push(`${key}=${encodeURIComponent(parsed[key])}`);
          }
        });
      }
    } catch (e) {
      console.error('Error reading UTMs from localStorage:', e);
    }
  }

  return utmParams.length > 0 ? utmParams.join('&') : '';
};

// Polish names for reviews
const polishReviews = [
  { name: 'Anna K.', text: 'Przepiękna pościel! Jakość materiału jest niesamowita.' },
  { name: 'Marta W.', text: 'Bardzo miękka i przyjemna w dotyku. Polecam!' },
  { name: 'Katarzyna M.', text: 'Świetna jakość za tę cenę. Jestem bardzo zadowolona.' },
  { name: 'Agnieszka P.', text: 'Kupiłam już drugi komplet. Najlepsza pościel jaką miałam!' },
  { name: 'Joanna B.', text: 'Materiał oddycha, śpię jak dziecko. Rewelacja!' },
];

// Generate persuasive description based on product
const getProductDescription = (subcategory: string, name: string) => {
  const descriptions: Record<string, string> = {
    'Capas de Edredon': `✨ **Luksusowa Pościel Premium** ✨\n\nNasza pościel wykonana jest z najwyższej jakości **100% egipskiej bawełny** o gęstości 400TC (Thread Count), która jest uznawana za standard luksusu w hotelach 5-gwiazdkowych na całym świecie.\n\n🏭 **Certyfikowana produkcja**: Tkanina została przetestowana przez niezależne laboratoria i posiada certyfikat OEKO-TEX Standard 100, gwarantujący brak szkodliwych substancji.\n\n🌿 **Egipska bawełna**: Uprawiana w dolinie Nilu, znana z wyjątkowo długich włókien, które zapewniają niezrównaną miękkość i trwałość.\n\n💤 **Termoregulacja**: Naturalna zdolność oddychania materiału zapewnia komfort zarówno w ciepłe, jak i chłodne noce.\n\n✅ Łatwa pielęgnacja - można prać w pralce\n✅ Nie mechaci się po praniu\n✅ Zachowuje kolor po wielu praniach`,
    'Lençóis': `✨ **Prześcieradło z Gumką Premium** ✨\n\nWykonane z **satyny bawełnianej 300TC** - materiału, który łączy elegancki połysk z niezwykłą miękkością. Każde prześcieradło przechodzi specjalny proces wykańczania, nadający mu jedwabistą gładkość.\n\n🔬 **Testowane w laboratoriach**: Nasze prześcieradła przeszły ponad 50 cykli prania bez utraty jakości i koloru.\n\n🌍 **Zrównoważona produkcja**: Bawełna pochodzi z certyfikowanych upraw, gdzie stosuje się zrównoważone metody nawadniania.\n\n📐 **Głęboka gumka 30cm**: Idealna do wysokich materacy, zapewnia pewne trzymanie przez całą noc.\n\n✅ Satynowy połysk\n✅ Hipoalergiczne\n✅ Oddychający materiał`,
    'Fronhas': `✨ **Poszewki na Poduszki Premium** ✨\n\nNasze poszewki to kwintesencja luksusu - wykonane z **organicznej bawełny percale** o gęstości 200TC, która jest standardem w najlepszych hotelach świata.\n\n🛏️ **Testowane przez ekspertów snu**: Współpracujemy z fizjoterapeutami, którzy potwierdzają, że nasze poszewki nie powodują podrażnień skóry.\n\n💆 **Jedwabista gładkość**: Specjalna obróbka enzymatyczna nadaje materiałowi niezwykłą delikatność, idealną dla wrażliwej skóry.\n\n🌙 **Chłodzący efekt**: Bawełna percale naturalnie odprowadza ciepło, zapewniając orzeźwiający sen.\n\n✅ Zamek błyskawiczny ukryty\n✅ Podwójne szwy\n✅ Nie gniecie się`,
    'Conjuntos': `✨ **Komplet Pościeli Luxury** ✨\n\nNasz komplet to harmonia elegancji i funkcjonalności. Każdy element został starannie dobrany, aby stworzyć spójną całość, która odmieni Twoją sypialnię.\n\n🏆 **Nagradzana kolekcja**: Nasza pościel zdobyła nagrodę "Best Bedding 2023" w konkursie European Home Awards.\n\n🧵 **Włoskie rzemiosło**: Szyjemy we Włoszech, gdzie tradycja tkacka sięga XII wieku. Każdy komplet jest kontrolowany przez doświadczonych rzemieślników.\n\n💎 **Ekskluzywne wykończenia**: Delikatne hafty i eleganckie lamówki nadają pościeli luksusowy charakter.\n\n✅ Komplet: poszwa + poszewki\n✅ Eleganckie opakowanie prezentowe\n✅ Idealny na prezent`,
  };
  return descriptions[subcategory] || descriptions['Capas de Edredon'];
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<typeof sizes[0]>(sizes[0]);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const realProduct = getProductById(productId);
  const relatedProductsData = realProduct ? getRelatedProducts(realProduct, 4) : products.slice(0, 4);

  // Generate social proof based on product id
  const socialProof = useMemo(() => {
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const peopleViewing = 15 + (hash % 30);
    const peopleBought = 100 + (hash % 400);
    const reviewIndex = hash % polishReviews.length;
    return {
      peopleViewing,
      peopleBought,
      featuredReview: polishReviews[reviewIndex]
    };
  }, [productId]);

  const product = realProduct ? {
    id: realProduct.id,
    name: realProduct.description,
    brand: 'SORELLE',
    rating: realProduct.rating || 4.7,
    reviewCount: 50 + Math.floor(Math.random() * 150),
    description: getProductDescription(realProduct.subcategory, realProduct.description),
    image: realProduct.image,
    price: realProduct.price,
    originalPrice: realProduct.originalPrice,
    discount: realProduct.discount,
    colors: realProduct.colors,
    subcategory: realProduct.subcategory,
  } : {
    id: productId,
    name: 'Pościel z egipskiej bawełny Premium',
    brand: 'SORELLE',
    rating: 4.8,
    reviewCount: 127,
    description: getProductDescription('Capas de Edredon', ''),
    image: undefined,
    price: 159.99,
    originalPrice: 259.99,
    discount: 38,
    colors: ['#4a90d9', '#ffffff', '#f5f5dc', '#ffc0cb'],
    subcategory: 'Capas de Edredon',
  };

  const colors = product.colors.map((color, i) => ({
    id: String(i + 1),
    name: `Kolor ${i + 1}`,
    color: color,
    image: product.image,
  }));

  const addToCart = () => {
    setIsAdding(true);

    const cartItem = {
      id: product.id,
      name: product.brand,
      description: product.name,
      color: colors[selectedColorIndex]?.name || 'Standardowy',
      size: selectedSize.name,
      price: selectedSize.price,
      originalPrice: selectedSize.originalPrice,
      quantity: 1,
      image: product.image || '',
      subcategory: product.subcategory,
    };

    const existingCart = JSON.parse(localStorage.getItem('lojaGemeosCart') || '[]');

    const existingIndex = existingCart.findIndex(
      (item: typeof cartItem) => item.id === cartItem.id && item.size === cartItem.size
    );

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('lojaGemeosCart', JSON.stringify(existingCart));

    setShowAddedMessage(true);
    setTimeout(() => {
      setIsAdding(false);
      setShowAddedMessage(false);
      router.push('/carrinho');
    }, 800);
  };

  // Handle redirect to Shopify checkout with UTMs
  const handleBuyNow = () => {
    setIsRedirecting(true);
    const utmParams = getUtmParams();
    let checkoutUrl = selectedSize.shopifyUrl;

    // Add UTM parameters to the Shopify URL
    if (utmParams) {
      const separator = checkoutUrl.includes('?') ? '&' : '?';
      checkoutUrl = `${checkoutUrl}${separator}${utmParams}`;
    }

    // Redirect to Shopify checkout
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Breadcrumb */}
      <div className="px-4 py-3 text-sm text-gray-500">
        <Link href="/" className="hover:text-black">Strona główna</Link>
        <span className="mx-2">/</span>
        <Link href="/cama" className="hover:text-black">Pościel</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.subcategory}</span>
      </div>

      {/* Product Image - No dots */}
      <div className="relative aspect-square bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageError || !product.image ? '/images/christmas-banner.jpg' : product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />

        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Badge */}
        {product.discount && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded">
            -{product.discount}%
          </span>
        )}

        {/* Live viewers */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {socialProof.peopleViewing} osób ogląda teraz
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        <h1 className="text-lg font-semibold text-gray-800 leading-tight">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount} opinii)</span>
        </div>

        {/* Social proof */}
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-800">
            <span className="font-bold">{socialProof.peopleBought}+ osób</span> kupiło ten produkt w tym miesiącu
          </p>
        </div>
      </div>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Kolor: {colors[selectedColorIndex]?.name}</p>
          <div className="flex gap-2">
            {colors.map((color, index) => (
              <button
                key={color.id}
                onClick={() => setSelectedColorIndex(index)}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColorIndex === index ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={() => setShowSizeModal(true)}
          className="w-full flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
        >
          <span className="text-gray-700">{selectedSize.name}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Price */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-black">
            {selectedSize.price.toFixed(2).replace('.', ',')} zł
          </span>
          <span className="line-through text-gray-400 text-lg">
            {selectedSize.originalPrice.toFixed(2).replace('.', ',')} zł
          </span>
        </div>

        {/* Payment on delivery badge */}
        <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <span className="font-bold text-amber-800">Płatność przy odbiorze</span>
            <p className="text-xs text-amber-700">Zapłać kurierowi przy dostawie - 100% bezpieczne</p>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-800">Darmowa dostawa od 200 zł</span>
            <p className="text-xs text-gray-500">Wysyłka w 24h, dostawa 2-4 dni</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-800">30 dni na zwrot</span>
            <p className="text-xs text-gray-500">Darmowy zwrot bez podania przyczyny</p>
          </div>
        </div>
      </div>

      {/* Featured Review */}
      <div className="px-4 py-4 border-t border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3">Opinia klientki</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-800">{socialProof.featuredReview.name}</span>
            <span className="text-xs text-green-600">✓ Zweryfikowany zakup</span>
          </div>
          <p className="text-sm text-gray-600 italic">&quot;{socialProof.featuredReview.text}&quot;</p>
        </div>
      </div>

      {/* Product Description */}
      <div className="px-4 py-4 border-t border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3">Opis produktu</h3>
        <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
          {product.description}
        </div>
      </div>

      {/* Related Products */}
      <div className="px-4 py-6 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Klienci kupili również</h2>
        <div className="grid grid-cols-2 gap-3">
          {relatedProductsData.slice(0, 4).map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              name={prod.name}
              description={prod.description}
              price={prod.price}
              originalPrice={prod.originalPrice}
              discount={prod.discount}
              rating={prod.rating}
              colors={prod.colors}
              moreColors={prod.moreColors}
              href={prod.href}
              image={prod.image}
            />
          ))}
        </div>
      </div>

      {/* Size Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSizeModal(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-4 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Wybierz rozmiar</h2>
              <button onClick={() => setShowSizeModal(false)} className="p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-2">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    setSelectedSize(size);
                    setShowSizeModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                    selectedSize?.id === size.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className={selectedSize?.id === size.id ? 'text-white' : 'text-gray-800'}>{size.name}</span>
                  <div className="text-right">
                    <span className={`line-through text-sm mr-2 ${selectedSize?.id === size.id ? 'text-gray-300' : 'text-gray-400'}`}>
                      {size.originalPrice.toFixed(2).replace('.', ',')} zł
                    </span>
                    <span className={`font-bold ${selectedSize?.id === size.id ? 'text-white' : 'text-black'}`}>
                      {size.price.toFixed(2).replace('.', ',')} zł
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Added to Cart Message */}
      {showAddedMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Dodano do koszyka!
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="p-4">
          <button
            onClick={handleBuyNow}
            disabled={isRedirecting}
            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isRedirecting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Przekierowywanie...
              </>
            ) : (
              <>
                KUP TERAZ - {selectedSize.price.toFixed(2).replace('.', ',')} zł
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
