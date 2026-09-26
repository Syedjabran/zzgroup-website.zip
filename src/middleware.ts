import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug } from '@/lib/catalogue/categories';

const LOCALES = ['en', 'ur'] as const;
const DEFAULT_LOCALE = 'en';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Next.js can otherwise emit a streamed soft-404 (HTTP 200) for an unknown
  // statically generated collection. Reject invalid catalogue slugs before
  // rendering so crawlers and clients receive the correct status code.
  const collectionMatch = pathname.match(/^\/(?:en|ur)\/collections\/([^/]+)\/?$/);
  if (collectionMatch && !getCategoryBySlug(collectionMatch[1])) {
    return new NextResponse(null, { status: 404 });
  }

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  const locale =
    cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
      ? cookieLocale
      : DEFAULT_LOCALE;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!admin|api|_next|.*\\..*).*)']
};
