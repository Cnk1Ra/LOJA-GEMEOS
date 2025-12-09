import { NextResponse } from 'next/server';

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || '';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

export async function GET() {
  // Check if credentials are configured
  const hasCredentials = !!(SHOPIFY_STORE_URL && SHOPIFY_ACCESS_TOKEN);

  if (!hasCredentials) {
    return NextResponse.json({
      success: false,
      error: 'Credentials not configured',
      hasStoreUrl: !!SHOPIFY_STORE_URL,
      hasAccessToken: !!SHOPIFY_ACCESS_TOKEN,
      storeUrl: SHOPIFY_STORE_URL ? `${SHOPIFY_STORE_URL.substring(0, 10)}...` : 'NOT SET'
    });
  }

  try {
    // Test connection by fetching shop info
    const response = await fetch(
      `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Shopify API error',
        status: response.status,
        details: data
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Shopify connection OK',
      shop: {
        name: data.shop?.name,
        email: data.shop?.email,
        domain: data.shop?.domain,
        currency: data.shop?.currency
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
