import type { Metadata } from 'next';
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import { notFound } from 'next/navigation';
import { isLocale, dir, type Locale } from '@/lib/i18n';
import '../../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const urdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-urdu',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.zzgroup.biz'),
  title: {
    default: 'Frame Mouldings, Wall Panels & Décor in Pakistan | ZZ Group',
    template: '%s | ZZ Group'
  },
  description:
    'Explore frame mouldings, framing accessories, fluted wall panels, WPC cladding and architectural décor from ZZ Group. Request wholesale pricing and delivery across Pakistan.'
};

// Pre-render both locales.
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

  // Setting lang + dir on <html> flips the ENTIRE interface for Urdu.
  return (
    <html lang={locale} dir={dir(locale as Locale)} className={`${inter.variable} ${urdu.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
