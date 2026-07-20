import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond, Noto_Nastaliq_Urdu } from 'next/font/google';
import { notFound } from 'next/navigation';
import { isLocale, dir, type Locale } from '@/lib/i18n';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import '../../globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});
const urdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-urdu',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.zzgroup.biz'),
  title: {
    default: "Premium Frame Mouldings, Wall Panels & Decorative Surfaces | ZZ GROUP",
    template: '%s | ZZ GROUP'
  },
  description:
    "Pakistan's premium architectural mouldings, wall panels and decorative surfaces brand. Frame mouldings, fluted panels, WPC cladding and interior finishing for residential, commercial and hospitality projects.",
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    siteName: 'ZZ GROUP',
    images: ['/logo.png']
  }
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ur' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;

  return (
    <html lang={locale} dir={dir(loc)} className={`${manrope.variable} ${cormorant.variable} ${urdu.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteHeader locale={loc} />
        <main id="main">{children}</main>
        <SiteFooter locale={loc} />
      </body>
    </html>
  );
}
