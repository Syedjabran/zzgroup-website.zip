import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.website) return NextResponse.json({ ok: true });

    const required = ['full_name', 'phone', 'city', 'customer_type', 'product_interest', 'message'];
    for (const f of required) {
      if (!body[f] || String(body[f]).trim() === '') {
        return NextResponse.json({ ok: false, error: `Missing ${f}` }, { status: 400 });
      }
    }
    if (!body.consent) {
      return NextResponse.json({ ok: false, error: 'Consent required' }, { status: 400 });
    }

    const clip = (v: unknown, n = 2000) => (v == null ? null : String(v).slice(0, n));

    const supabase = createAdminClient();
    const { error } = await supabase.from('enquiries').insert({
      full_name: clip(body.full_name, 120),
      company_name: clip(body.company_name, 160),
      phone: clip(body.phone, 40),
      email: clip(body.email, 160),
      city: clip(body.city, 80),
      customer_type: body.customer_type,
      product_interest: body.product_interest,
      product_sku: clip(body.product_sku, 60),
      preferred_material: clip(body.preferred_material, 80),
      preferred_colour: clip(body.preferred_colour, 80),
      dimensions: clip(body.dimensions, 120),
      quantity: clip(body.quantity, 120),
      message: clip(body.message, 4000),
      consent: true,
      preferred_language: body.preferred_language === 'ur' ? 'ur' : 'en',
      source_page: clip(body.source_page, 200)
    });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}