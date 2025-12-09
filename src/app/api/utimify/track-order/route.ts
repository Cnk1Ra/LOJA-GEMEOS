import { NextRequest, NextResponse } from 'next/server';

// Utimify credentials from environment variables
const UTIMIFY_API_URL = process.env.UTIMIFY_API_URL || '';
const UTIMIFY_API_KEY = process.env.UTIMIFY_API_KEY || '';
const UTIMIFY_STORE_ID = process.env.UTIMIFY_STORE_ID || '';

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
  orderNumber: string;
  shopifyOrderId?: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  voivodeship: string;
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
  if (!UTIMIFY_API_URL || !UTIMIFY_API_KEY) {
    console.error('Utimify credentials not configured');
    return NextResponse.json(
      {
        success: false,
        error: 'Utimify nie jest skonfigurowany'
      },
      { status: 500 }
    );
  }

  try {
    const orderData: OrderData = await request.json();

    // Build line items for Utimify
    const lineItems = orderData.cartItems.map(item => ({
      product_id: item.id,
      name: item.description,
      quantity: item.quantity,
      price: item.price,
      variant: `${item.color} - ${item.size}`
    }));

    // Add selected upsells
    const selectedUpsells = orderData.upsellItems.filter(item => item.selected);
    selectedUpsells.forEach(item => {
      lineItems.push({
        product_id: item.id,
        name: item.description,
        quantity: 1,
        price: item.price,
        variant: 'Upsell'
      });
    });

    // Build Utimify payload
    const utimifyPayload = {
      store_id: UTIMIFY_STORE_ID,
      order_id: orderData.orderNumber,
      external_order_id: orderData.shopifyOrderId || orderData.orderNumber,
      customer: {
        email: orderData.email,
        first_name: orderData.name,
        last_name: orderData.lastName,
        phone: `+48${orderData.phone.replace(/\s/g, '')}`
      },
      shipping_address: {
        address1: orderData.address,
        city: orderData.city,
        province: orderData.voivodeship,
        zip: orderData.postalCode,
        country: 'PL',
        country_code: 'PL'
      },
      line_items: lineItems,
      subtotal: orderData.subtotal,
      shipping: orderData.shippingCost,
      total: orderData.total,
      currency: 'PLN',
      payment_method: 'cod', // Cash on delivery
      status: 'pending',
      source: 'sorelle-frontend',
      created_at: new Date().toISOString()
    };

    // Send to Utimify API
    const response = await fetch(UTIMIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UTIMIFY_API_KEY}`,
        'X-API-Key': UTIMIFY_API_KEY
      },
      body: JSON.stringify(utimifyPayload),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Utimify API Error:', responseData);
      return NextResponse.json(
        {
          success: false,
          error: responseData.error || responseData.message || 'Błąd Utimify',
          details: responseData
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      utimifyId: responseData.id || responseData.order_id,
      message: 'Order tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking order in Utimify:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Wystąpił błąd podczas wysyłania do Utimify'
      },
      { status: 500 }
    );
  }
}
