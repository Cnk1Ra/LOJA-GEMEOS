const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, '../produtos_laredoute.html'), 'utf-8');

// Regular expression to extract product data
const productRegex = /<div class="product">\s*<a href="([^"]+)"[^>]*>\s*<img src="([^"]+)"[^>]*alt="([^"]+)"[^>]*>\s*<\/a>\s*<div class="product-info">\s*<div class="brand">([^<]+)<\/div>\s*<div class="name">([^<]+)<\/div>\s*<div class="prices">\s*<span class="price-original">([^<]+)<\/span>\s*<span class="price-final">([^<]+)<\/span>\s*<span class="discount">([^<]+)<\/span>\s*<\/div>\s*<div class="rating">[^<]*([^<]*)<\/div>\s*(?:<span class="promo">([^<]*)<\/span>)?/g;

const products = [];
let match;

while ((match = productRegex.exec(htmlContent)) !== null) {
  const [, url, image, alt, brand, name, originalPrice, finalPrice, discount, rating, promo] = match;

  // Extract product ID from URL
  const productIdMatch = url.match(/prod-(\d+)/);
  const productId = productIdMatch ? productIdMatch[1] : null;

  if (!productId) continue;

  // Skip products with placeholder images or broken URLs
  if (image.includes('placeholder') || image.includes('via.placeholder') || !image.includes('wsrv.nl')) {
    continue;
  }

  // Parse prices (remove € and convert to number)
  const parsePrice = (price) => {
    return parseFloat(price.replace('€', '').replace(',', '.').trim()) || 0;
  };

  // Parse discount (remove - and %)
  const parseDiscount = (disc) => {
    return parseInt(disc.replace('-', '').replace('%', '').trim()) || 0;
  };

  // Parse rating (extract number)
  const parseRating = (rat) => {
    const ratingMatch = rat.match(/(\d+[,.]?\d*)/);
    return ratingMatch ? parseFloat(ratingMatch[1].replace(',', '.')) : 0;
  };

  // Determine subcategory based on product name - ONLY BED PRODUCTS
  const determineSubcategory = (productName) => {
    const lowerName = productName.toLowerCase();

    // Exclude non-bed products
    if (lowerName.includes('toalha de banho') || lowerName.includes('roupão') ||
        lowerName.includes('tapete de banho') || lowerName.includes('toalhete') ||
        lowerName.includes('toalha de mesa') || lowerName.includes('guardanapo') ||
        lowerName.includes('jogo americano') || lowerName.includes('avental') ||
        lowerName.includes('pano de cozinha') || lowerName.includes('cortina') ||
        lowerName.includes('tapete') || lowerName.includes('almofada decorativa')) {
      return null; // Will be filtered out
    }

    // Capas de edredon / edredão
    if (lowerName.includes('capa de edredon') || lowerName.includes('capa de edredão')) {
      return 'Capas de Edredon';
    }

    // Lençóis-capa (fitted sheets)
    if (lowerName.includes('lençol-capa') || lowerName.includes('lençol capa') ||
        (lowerName.includes('lençol') && lowerName.includes('ajustável'))) {
      return 'Lençóis-Capa';
    }

    // Fronhas (pillowcases)
    if (lowerName.includes('fronha')) {
      return 'Fronhas';
    }

    // Lençóis (flat sheets) - must check after lençóis-capa
    if (lowerName.includes('lençol') && !lowerName.includes('capa')) {
      return 'Lençóis';
    }

    // Conjuntos de cama (bedding sets)
    if (lowerName.includes('conjunto') || lowerName.includes('jogo de cama')) {
      return 'Conjuntos';
    }

    // Colchas (bedspreads/quilts)
    if (lowerName.includes('colcha')) {
      return 'Colchas';
    }

    // Mantas (throws/blankets)
    if (lowerName.includes('manta')) {
      return 'Mantas';
    }

    // Cobertores (blankets)
    if (lowerName.includes('cobertor')) {
      return 'Cobertores';
    }

    // Almofadas de cama (bed pillows - not decorative)
    if (lowerName.includes('almofada') && !lowerName.includes('decorativ')) {
      return 'Almofadas';
    }

    // Protetores de colchão
    if (lowerName.includes('resguardo') || lowerName.includes('protetor') || lowerName.includes('capa de colchão')) {
      return 'Protetores';
    }

    // If it's a bed-related product but doesn't match specific categories
    if (lowerName.includes('cama') || lowerName.includes('dormir') || lowerName.includes('edred')) {
      return 'Outros';
    }

    return null; // Filter out non-bed products
  };

  const subcategory = determineSubcategory(name);

  // Skip products that aren't bed-related
  if (!subcategory) continue;

  products.push({
    id: productId,
    url: url.split('#')[0],
    image: image,
    brand: brand.trim(),
    name: name.trim(),
    originalPrice: parsePrice(originalPrice),
    discount: parseDiscount(discount),
    price: parsePrice(finalPrice),
    rating: parseRating(rating || ''),
    badge: promo ? promo.trim() : '',
    subcategory: subcategory,
  });
}

console.log(`Extracted ${products.length} bed products`);

// Count by subcategory
const subcategoryCounts = {};
products.forEach(p => {
  subcategoryCounts[p.subcategory] = (subcategoryCounts[p.subcategory] || 0) + 1;
});
console.log('Subcategories:', subcategoryCounts);

// Helper to escape single quotes
const escapeStr = (str) => str.replace(/'/g, "\\'");

// Define subcategory order for display
const subcategoryOrder = [
  'Capas de Edredon',
  'Lençóis-Capa',
  'Lençóis',
  'Fronhas',
  'Conjuntos',
  'Colchas',
  'Mantas',
  'Cobertores',
  'Almofadas',
  'Protetores',
  'Outros'
];

// Generate the TypeScript file content
const tsContent = `export interface Product {
  id: string;
  url: string;
  image: string;
  brand: string;
  name: string;
  description: string;
  originalPrice: number;
  discount: number;
  price: number;
  rating: number;
  badge: string;
  colors: string[];
  moreColors: number;
  subcategory: string;
  href: string;
}

// Subcategorias disponíveis (ordem de exibição)
export const subcategories = ${JSON.stringify(subcategoryOrder.filter(s => subcategoryCounts[s]), null, 2)};

// Produtos extraídos da La Redoute com imagens via wsrv.nl proxy
// Total: ${products.length} produtos de cama
export const products: Product[] = [
${products.map(p => `  {
    id: '${p.id}',
    url: '${escapeStr(p.url)}',
    image: '${escapeStr(p.image)}',
    brand: '${escapeStr(p.brand)}',
    name: 'LOJA GÊMEOS',
    description: '${escapeStr(p.name)}',
    originalPrice: ${p.originalPrice},
    discount: ${p.discount},
    price: ${p.price},
    rating: ${p.rating},
    badge: '${escapeStr(p.badge)}',
    colors: [],
    moreColors: 0,
    subcategory: '${escapeStr(p.subcategory)}',
    href: '/produto/${p.id}',
  }`).join(',\n')}
];

// Helper functions to filter products
export function getProductsBySubcategory(subcategory: string): Product[] {
  return products.filter(p => p.subcategory === subcategory);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getRelatedProducts(product: Product, limit: number = 6): Product[] {
  return products
    .filter(p => p.id !== product.id && p.subcategory === product.subcategory)
    .slice(0, limit);
}

// Export counts for each subcategory
export const subcategoryCounts: Record<string, number> = {
${Object.entries(subcategoryCounts).map(([k, v]) => `  '${k}': ${v}`).join(',\n')}
};
`;

// Write the TypeScript file
fs.writeFileSync(path.join(__dirname, '../src/data/products.ts'), tsContent);
console.log('products.ts has been updated successfully!');
