import en from '@/i18n/en.json';
import ur from '@/i18n/ur.json';

export const locales = ['en', 'ur'] as const;
export type Locale = (typeof locales)[number];
export const dictionaries = { en, ur } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

export function dir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ur' ? 'rtl' : 'ltr';
}

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}