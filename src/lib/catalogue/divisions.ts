import type { Locale } from "@/lib/i18n";
import { CATALOGUE_CATEGORIES, type CatalogueCategory } from "./categories";

type LocalisedText = Record<Locale, string>;

export type DivisionSlug = "zzmolding" | "zzdecor" | "zzindustries";

export interface DivisionBranch {
  /** Human-facing phone as written by the client, e.g. "0333 4813016". */
  phoneDisplay: string;
  /** E.164 dial string for tel: links, e.g. "+923334813016". */
  phoneDial: string;
  /** Digits only for wa.me links, e.g. "923334813016". */
  whatsapp: string;
  address: LocalisedText;
  /** Optional Google Maps share link; omitted when not yet available. */
  mapUrl?: string;
  email: string;
}

export interface Division {
  slug: DivisionSlug;
  /** Brand slug used for Supabase brand lookup (matches `brands.slug`). */
  brandSlug: string;
  /** Display name for tabs/nav, e.g. "ZZ Moulding". */
  name: LocalisedText;
  /** Uppercase wordmark, e.g. "ZZMOLDING". */
  wordmark: string;
  tagline: LocalisedText;
  intro: LocalisedText;
  heroLabel: LocalisedText;
  seoTitle: LocalisedText;
  seoDescription: LocalisedText;
  branch: DivisionBranch;
  /** True when the online catalogue for this division is not yet populated. */
  catalogueComingSoon?: boolean;
}

export const DIVISIONS: readonly Division[] = [
  {
    slug: "zzmolding",
    brandSlug: "zzmolding",
    name: { en: "ZZ Moulding", ur: "زیڈ زی مولڈنگ" },
    wordmark: "ZZMOLDING",
    tagline: {
      en: "Make the frame part of the art.",
      ur: "فریم کو فن کا حصہ بنائیں۔",
    },
    intro: {
      en: "Profiles, finishes and accessories selected for professional framers, galleries, retailers and wholesale buyers—organised by material, finish and colour.",
      ur: "پیشہ ورانہ فریمرز، گیلریز، ریٹیلرز اور ہول سیل خریداروں کے لیے منتخب پروفائلز، فنشز اور لوازمات—مواد، فنش اور رنگ کے مطابق ترتیب شدہ۔",
    },
    heroLabel: {
      en: "ZZ Group · Framing division",
      ur: "زیڈ زی گروپ · فریمنگ ڈویژن",
    },
    seoTitle: {
      en: "ZZ Moulding — Frame Mouldings & Framing Supplies | ZZ Group",
      ur: "زیڈ زی مولڈنگ — فریم مولڈنگز اور فریمنگ سپلائیز | زیڈ زی گروپ",
    },
    seoDescription: {
      en: "Frame moulding profiles, finishes and framing accessories from ZZ Moulding for framers, galleries and retailers across Pakistan.",
      ur: "پاکستان بھر میں فریمرز، گیلریز اور ریٹیلرز کے لیے زیڈ زی مولڈنگ کے فریم پروفائلز، فنشز اور فریمنگ لوازمات۔",
    },
    branch: {
      phoneDisplay: "0333 4813016",
      phoneDial: "+923334813016",
      whatsapp: "923334813016",
      address: {
        en: "Kashif Center 1, Mission Road, Lahore",
        ur: "کاشف سینٹر 1، مشن روڈ، لاہور",
      },
      mapUrl: "https://share.google/SmXyo6uKvLxnf4j8J",
      email: "contact@zzgroup.biz",
    },
  },
  {
    slug: "zzdecor",
    brandSlug: "zzdecor",
    name: { en: "ZZ Decor", ur: "زیڈ زی ڈیکور" },
    wordmark: "ZZDECOR",
    tagline: {
      en: "Turn walls into architecture.",
      ur: "دیواروں کو آرکیٹیکچر میں بدلیں۔",
    },
    intro: {
      en: "Wall panels, cladding, statement sheets and architectural trims for residential, commercial and hospitality interiors—identified by verified composition, finish and dimensions.",
      ur: "رہائشی، کمرشل اور ہاسپیٹیلیٹی انٹیریئرز کے لیے وال پینلز، کلیڈنگ، آرائشی شیٹس اور آرکیٹیکچرل ٹرِمز—تصدیق شدہ ساخت، فنش اور ابعاد کے ساتھ۔",
    },
    heroLabel: {
      en: "ZZ Group · Décor division",
      ur: "زیڈ زی گروپ · ڈیکور ڈویژن",
    },
    seoTitle: {
      en: "ZZ Decor — Wall Panels, WPC Cladding & Architectural Surfaces | ZZ Group",
      ur: "زیڈ زی ڈیکور — وال پینلز، ڈبلیو پی سی کلیڈنگ اور آرکیٹیکچرل سطحیں | زیڈ زی گروپ",
    },
    seoDescription: {
      en: "Decorative wall panels, WPC cladding, marble & onyx sheets and architectural trims from ZZ Decor for interior projects across Pakistan.",
      ur: "پاکستان بھر میں انٹیریئر پراجیکٹس کے لیے زیڈ زی ڈیکور کے آرائشی وال پینلز، ڈبلیو پی سی کلیڈنگ، ماربل و اونکس شیٹس اور آرکیٹیکچرل ٹرِمز۔",
    },
    branch: {
      phoneDisplay: "0337 4813016",
      phoneDial: "+923374813016",
      whatsapp: "923374813016",
      address: {
        en: "Kashif Center 1, Mission Road, Lahore",
        ur: "کاشف سینٹر 1، مشن روڈ، لاہور",
      },
      mapUrl: "https://share.google/SmXyo6uKvLxnf4j8J",
      email: "contact@zzgroup.biz",
    },
  },
  {
    slug: "zzindustries",
    brandSlug: "zzindustries",
    name: { en: "ZZ Industries", ur: "زیڈ زی انڈسٹریز" },
    wordmark: "ZZINDUSTRIES",
    tagline: {
      en: "Manufacturing behind the finish.",
      ur: "فنش کے پیچھے مینوفیکچرنگ۔",
    },
    intro: {
      en: "The group's manufacturing operation at the Kasur (PSIC) estate, supplying the moulding and décor divisions and serving trade and industrial requirements. Contact the team for the current production catalogue and project supply.",
      ur: "کصور (پی ایس آئی سی) اسٹیٹ پر گروپ کا مینوفیکچرنگ یونٹ، جو مولڈنگ اور ڈیکور ڈویژنز کو سپلائی کرتا ہے اور ٹریڈ و صنعتی ضروریات پوری کرتا ہے۔ موجودہ پروڈکشن کیٹلاگ اور پراجیکٹ سپلائی کے لیے ٹیم سے رابطہ کریں۔",
    },
    heroLabel: {
      en: "ZZ Group · Manufacturing division",
      ur: "زیڈ زی گروپ · مینوفیکچرنگ ڈویژن",
    },
    seoTitle: {
      en: "ZZ Industries — Manufacturing & Industrial Supply | ZZ Group",
      ur: "زیڈ زی انڈسٹریز — مینوفیکچرنگ اور صنعتی سپلائی | زیڈ زی گروپ",
    },
    seoDescription: {
      en: "ZZ Industries is the manufacturing division of ZZ Group, based at the PSIC estate in Kasur. Contact us for production capabilities and industrial supply.",
      ur: "زیڈ زی انڈسٹریز زیڈ زی گروپ کا مینوفیکچرنگ ڈویژن ہے، جو کصور کے پی ایس آئی سی اسٹیٹ میں واقع ہے۔ پیداواری صلاحیت اور صنعتی سپلائی کے لیے رابطہ کریں۔",
    },
    branch: {
      phoneDisplay: "0319 483016",
      phoneDial: "+92319483016",
      whatsapp: "92319483016",
      address: {
        en: "Plot No. 13A-14A, (PSIC), Kasur",
        ur: "پلاٹ نمبر 13A-14A، (پی ایس آئی سی)، کصور",
      },
      email: "contact@zzgroup.biz",
    },
    catalogueComingSoon: true,
  },
];

export function getDivisionBySlug(slug: string): Division | undefined {
  return DIVISIONS.find((division) => division.slug === slug);
}

export function divisionPath(locale: Locale, slug: string): string {
  return `/${locale}/products/${slug}`;
}

/** Categories that belong to a division, in registry order. */
export function categoriesForDivision(slug: DivisionSlug): CatalogueCategory[] {
  return CATALOGUE_CATEGORIES.filter((category) => category.division === slug);
}
