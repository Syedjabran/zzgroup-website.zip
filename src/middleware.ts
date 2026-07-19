import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'ur'] as const;
const DEFAULT_LOCALE = 'en';

/**
 * Ensures every public path is locale-prefixed (/en/... or /ur/...).
 * Root "/" and any unprefixed path rewrite/redirect to the visitor's
 * remembered locale (cookie) or English. Admin + assets are excluded.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  // Skip admin, api, next internals, and files with an extension.
  matcher: ['/((?!admin|api|_next|.*\\..*).*)']
};
