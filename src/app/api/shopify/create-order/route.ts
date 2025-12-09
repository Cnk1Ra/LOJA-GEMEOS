import { NextRequest, NextResponse } from 'next/server';

// Shopify credentials from environment variables
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || '';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

interface CartItem {
  id: string;
  name: string;
  description: string;
  color: string;
  size: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
}

interface UpsellItem {
  id: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  selected: boolean;
}

interface OrderData {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  voivodeship: string;
  notes: string;
  cartItems: CartItem[];
  upsellItems: UpsellItem[];
  subtotal: number;
  shippingCost: number;
  extrasTotal: number;
  upsellTotal: number;
  total: number;
}

export async function POST(request: NextRequest) {
  // Check if credentials are configured
  if (!SHOPIFY_STORE_URL || !SHOPIFY_ACCESS_TOKEN) {
    console.error('Shopify credentials not configured');
    return NextResponse.json(
      {
        success: false,
        error: 'Shopify nie jest skonfigurowany. Skontaktuj się z administratorem.'
      },
      { status: 500 }
    );
  }

  try {
    const orderData: OrderData = await request.json();

    // Format phone number properly - remove all non-digits and add country code
    const cleanPhone = orderData.phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('48') ? `+${cleanPhone}` : `+48${cleanPhone}`;

    // Build line items from cart
    const lineItems = orderData.cartItems.map(item => ({
      title: item.description,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      requires_shipping: true,
      taxable: true,
      properties: [
        { name: 'Kolor', value: item.color },
        { name: 'Rozmiar', value: item.size },
        { name: 'ID Produktu', value: item.id }
      ]
    }));

    // Add upsell items
    const selectedUpsells = orderData.upsellItems.filter(item => item.selected);
    selectedUpsells.forEach(item => {
      lineItems.push({
        title: `[UPSELL] ${item.description}`,
        quantity: 1,
        price: item.price.toFixed(2),
        requires_shipping: true,
        taxable: true,
        properties: [
          { name: 'Typ', value: 'Upsell' },
          { name: 'ID Produktu', value: item.id }
        ]
      });
    });

    // Build shipping line if applicable
    const shippingLines = orderData.shippingCost > 0 ? [
      {
        title: 'Dostawa kurierska',
        price: orderData.shippingCost.toFixed(2),
        code: 'STANDARD'
      }
    ] : [
      {
        title: 'Darmowa dostawa',
        price: '0.00',
        code: 'FREE'
      }
    ];

    // Create the order payload
    const shopifyOrder = {
      order: {
        email: orderData.email,
        phone: formattedPhone,
        financial_status: 'pending', // Payment on delivery
        fulfillment_status: null,
        send_receipt: true,
        send_fulfillment_receipt: true,
        note: orderData.notes || 'Zamówienie ze strony Sorelle - Płatność przy odbiorze',
        tags: 'sorelle-frontend,platnosc-przy-odbiorze,cod',
        line_items: lineItems,
        shipping_lines: shippingLines,
        shipping_address: {
          first_name: orderData.name,
          last_name: orderData.lastName,
          address1: orderData.address,
          city: orderData.city,
          province: orderData.voivodeship,
          zip: orderData.postalCode,
          country: 'PL',
          country_code: 'PL',
          phone: formattedPhone
        },
        billing_address: {
          first_name: orderData.name,
          last_name: orderData.lastName,
          address1: orderData.address,
          city: orderData.city,
          province: orderData.voivodeship,
          zip: orderData.postalCode,
          country: 'PL',
          country_code: 'PL',
          phone: formattedPhone
        },
        customer: {
          email: orderData.email,
          first_name: orderData.name,
          last_name: orderData.lastName,
          phone: formattedPhone,
          accepts_marketing: true
        },
        inventory_behaviour: 'bypass', // Don't decrement inventory (manual control)
        source_name: 'sorelle-frontend'
      }
    };

    // Call Shopify API
    const response = await fetch(
      `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify(shopifyOrder),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Shopify API Error:', responseData);
      return NextResponse.json(
        {
          success: false,
          error: responseData.errors || 'Błąd podczas tworzenia zamówienia',
          details: responseData
        },
        { status: response.status }
      );
    }

    // Return success with order details
    return NextResponse.json({
      success: true,
      orderNumber: responseData.order.order_number,
      orderId: responseData.order.id,
      orderName: responseData.order.name,
      totalPrice: responseData.order.total_price,
      createdAt: responseData.order.created_at
    });

  } catch (error) {
    console.error('Error creating Shopify order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Wystąpił błąd serwera podczas tworzenia zamówienia'
      },
      { status: 500 }
    );
  }
}
