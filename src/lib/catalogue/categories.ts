import type { Locale } from "@/lib/i18n";

export type CategoryFacet = "material" | "colour" | "finish" | "texture";

type LocalisedText = Record<Locale, string>;

export interface CatalogueCategory {
  slug: string;
  division: "zzmolding" | "zzdecor";
  name: LocalisedText;
  intro: LocalisedText;
  empty: LocalisedText;
  seoTitle: LocalisedText;
  seoDescription: LocalisedText;
  heroLabel: LocalisedText;
  facets: readonly CategoryFacet[];
  categoryAliases: readonly string[];
  fallback?: {
    productType:
      "frame_moulding" | "wall_panel" | "cladding" | "sheet" | "trim";
    materialContains?: string;
  };
}

export const CATALOGUE_CATEGORIES: readonly CatalogueCategory[] = [
  {
    slug: "frame-mouldings",
    division: "zzmolding",
    name: { en: "Frame Mouldings", ur: "فریم مولڈنگز" },
    intro: {
      en: "Profiles for professional picture framing, galleries, mirrors and presentation work—organised by verified material, finish and colour.",
      ur: "پیشہ ورانہ پکچر فریمنگ، گیلریز، آئینوں اور پریزنٹیشن کے لیے پروفائلز—تصدیق شدہ مواد، فنش اور رنگ کے مطابق۔",
    },
    empty: {
      en: "Our online Frame Mouldings selection is currently being prepared. Contact the ZZMOLDING team for the latest catalogue, available finishes and trade quotation.",
      ur: "ہماری آن لائن فریم مولڈنگز کلیکشن تیار کی جا رہی ہے۔ تازہ ترین کیٹلاگ، دستیاب فنشز اور ٹریڈ کوٹیشن کے لیے زیڈ زی مولڈنگ ٹیم سے رابطہ کریں۔",
    },
    seoTitle: {
      en: "Frame Mouldings in Pakistan — ZZMOLDING",
      ur: "پاکستان میں فریم مولڈنگز — زیڈ زی مولڈنگ",
    },
    seoDescription: {
      en: "Browse verified frame moulding profiles from ZZMOLDING for professional framers, retailers and projects across Pakistan.",
      ur: "پاکستان بھر میں پیشہ ور فریمرز، ریٹیلرز اور پراجیکٹس کے لیے زیڈ زی مولڈنگ کے تصدیق شدہ فریم پروفائلز دیکھیں۔",
    },
    heroLabel: {
      en: "ZZMOLDING · Professional framing",
      ur: "زیڈ زی مولڈنگ · پیشہ ورانہ فریمنگ",
    },
    facets: ["material", "colour", "finish", "texture"],
    categoryAliases: [
      "frame-mouldings",
      "frame-moulding",
      "frame_mouldings",
      "frame_moulding",
    ],
    fallback: { productType: "frame_moulding" },
  },
  {
    slug: "wall-panels",
    division: "zzdecor",
    name: { en: "Wall Panels", ur: "وال پینلز" },
    intro: {
      en: "Interior wall-panel systems selected for dimensional rhythm, finish and practical project coordination.",
      ur: "اندرونی دیواروں کے لیے پینل سسٹمز—ابعاد، ترتیب، فنش اور پراجیکٹ ضروریات کے مطابق منتخب کردہ۔",
    },
    empty: {
      en: "Our online Wall Panels selection is being prepared. Contact ZZDECOR for the current panel catalogue, finish samples, dimensions and project quotation.",
      ur: "ہماری آن لائن وال پینلز کلیکشن تیار کی جا رہی ہے۔ موجودہ کیٹلاگ، فنش نمونوں، ابعاد اور پراجیکٹ کوٹیشن کے لیے زیڈ زی ڈیکور سے رابطہ کریں۔",
    },
    seoTitle: {
      en: "Decorative Wall Panels in Pakistan | ZZDECOR",
      ur: "پاکستان میں آرائشی وال پینلز | زیڈ زی ڈیکور",
    },
    seoDescription: {
      en: "Explore verified decorative wall panels from ZZDECOR with current finish, material and project information.",
      ur: "زیڈ زی ڈیکور کے تصدیق شدہ آرائشی وال پینلز، فنشز، مواد اور پراجیکٹ معلومات دریافت کریں۔",
    },
    heroLabel: {
      en: "ZZDECOR · Interior wall systems",
      ur: "زیڈ زی ڈیکور · اندرونی وال سسٹمز",
    },
    facets: ["material", "colour", "finish", "texture"],
    categoryAliases: ["wall-panels", "wall-panel", "wall_panels", "wall_panel"],
  },
  {
    slug: "marble-onyx-panels",
    division: "zzdecor",
    name: { en: "Marble & Onyx Panels", ur: "ماربل اور اونکس پینلز" },
    intro: {
      en: "Decorative marble-look and onyx-look sheets, clearly identified by verified composition, pattern, finish and dimensions.",
      ur: "ماربل لک اور اونکس لک آرائشی شیٹس—تصدیق شدہ ساخت، پیٹرن، فنش اور ابعاد کے ساتھ واضح طور پر شناخت شدہ۔",
    },
    empty: {
      en: "Our online Marble & Onyx Panels selection is being prepared. Ask ZZDECOR for the latest compositions, patterns, samples and project quotation.",
      ur: "ہماری آن لائن ماربل اور اونکس پینلز کلیکشن تیار کی جا رہی ہے۔ تازہ ترین ساخت، پیٹرنز، نمونوں اور کوٹیشن کے لیے زیڈ زی ڈیکور سے رابطہ کریں۔",
    },
    seoTitle: {
      en: "Marble & Onyx Decorative Panels | ZZDECOR Pakistan",
      ur: "ماربل اور اونکس آرائشی پینلز | زیڈ زی ڈیکور پاکستان",
    },
    seoDescription: {
      en: "Browse verified marble-look and onyx-look decorative panels from ZZDECOR, with composition and finish clearly identified.",
      ur: "زیڈ زی ڈیکور کے تصدیق شدہ ماربل لک اور اونکس لک آرائشی پینلز واضح ساخت اور فنش کے ساتھ دیکھیں۔",
    },
    heroLabel: {
      en: "ZZDECOR · Statement sheets",
      ur: "زیڈ زی ڈیکور · آرائشی شیٹس",
    },
    facets: ["material", "colour", "finish", "texture"],
    categoryAliases: [
      "marble-onyx-panels",
      "marble-onyx",
      "marble_onyx_panels",
    ],
  },
  {
    slug: "wpc-cladding",
    division: "zzdecor",
    name: { en: "WPC Cladding", ur: "ڈبلیو پی سی کلیڈنگ" },
    intro: {
      en: "Verified WPC cladding profiles arranged by colour, finish and documented application—without unsupported performance claims.",
      ur: "تصدیق شدہ ڈبلیو پی سی کلیڈنگ پروفائلز—رنگ، فنش اور دستاویزی استعمال کے مطابق، بغیر غیر مصدقہ دعوؤں کے۔",
    },
    empty: {
      en: "Our online WPC Cladding selection is being prepared. Contact ZZDECOR for current profiles, colours, dimensions and documented applications.",
      ur: "ہماری آن لائن ڈبلیو پی سی کلیڈنگ کلیکشن تیار کی جا رہی ہے۔ موجودہ پروفائلز، رنگوں، ابعاد اور دستاویزی استعمال کے لیے زیڈ زی ڈیکور سے رابطہ کریں۔",
    },
    seoTitle: {
      en: "WPC Cladding Panels in Pakistan | ZZDECOR",
      ur: "پاکستان میں ڈبلیو پی سی کلیڈنگ پینلز | زیڈ زی ڈیکور",
    },
    seoDescription: {
      en: "Explore verified WPC cladding profiles from ZZDECOR by colour, finish, dimensions and documented application.",
      ur: "زیڈ زی ڈیکور کے تصدیق شدہ ڈبلیو پی سی کلیڈنگ پروفائلز رنگ، فنش، ابعاد اور دستاویزی استعمال کے مطابق دیکھیں۔",
    },
    heroLabel: {
      en: "ZZDECOR · WPC profiles",
      ur: "زیڈ زی ڈیکور · ڈبلیو پی سی پروفائلز",
    },
    facets: ["colour", "finish", "texture"],
    categoryAliases: ["wpc-cladding", "wpc_cladding"],
    fallback: { productType: "cladding", materialContains: "WPC" },
  },
  {
    slug: "decorative-surfaces",
    division: "zzdecor",
    name: { en: "Decorative Surfaces", ur: "آرائشی سطحیں" },
    intro: {
      en: "Feature surfaces whose primary role is decorative finish rather than wall-panel structure, stone-look sheet or finishing profile.",
      ur: "ایسی فیچر سطحیں جن کا بنیادی کردار آرائشی فنش ہے—وال پینل سسٹم، اسٹون لک شیٹ یا فنشنگ پروفائل نہیں۔",
    },
    empty: {
      en: "The Decorative Surfaces online edit is being defined carefully to avoid duplicating Wall Panels or Marble & Onyx. Contact ZZDECOR for current feature finishes and samples.",
      ur: "آرائشی سطحوں کی آن لائن کلیکشن احتیاط سے مرتب کی جا رہی ہے تاکہ وال پینلز یا ماربل و اونکس کی نقل نہ ہو۔ موجودہ فنشز اور نمونوں کے لیے زیڈ زی ڈیکور سے رابطہ کریں۔",
    },
    seoTitle: {
      en: "Decorative Interior Surfaces | ZZDECOR Pakistan",
      ur: "آرائشی اندرونی سطحیں | زیڈ زی ڈیکور پاکستان",
    },
    seoDescription: {
      en: "Discover verified feature finishes classified as decorative surfaces by ZZDECOR, distinct from wall panels and stone-look sheets.",
      ur: "زیڈ زی ڈیکور کی تصدیق شدہ فیچر فنشز دیکھیں، جو وال پینلز اور اسٹون لک شیٹس سے الگ آرائشی سطحوں کے طور پر درجہ بند ہیں۔",
    },
    heroLabel: {
      en: "ZZDECOR · Feature finishes",
      ur: "زیڈ زی ڈیکور · فیچر فنشز",
    },
    facets: ["material", "colour", "finish", "texture"],
    categoryAliases: [
      "decorative-surfaces",
      "decorative-surface",
      "decorative_surfaces",
    ],
  },
  {
    slug: "skirting-cornices-trims",
    division: "zzdecor",
    name: { en: "Skirting, Cornices & Trims", ur: "اسکرٹنگ، کارنس اور ٹرِمز" },
    intro: {
      en: "Finishing profiles for floor lines, wall frames, ceiling transitions, lighting details and resolved interior edges.",
      ur: "فلور لائنز، وال فریمز، سیلنگ ٹرانزیشنز، لائٹنگ ڈیٹیلز اور مکمل اندرونی کناروں کے لیے فنشنگ پروفائلز۔",
    },
    empty: {
      en: "Our online Skirting, Cornices & Trims selection is being prepared. Contact ZZDECOR for current profile types, materials, dimensions and finishes.",
      ur: "ہماری آن لائن اسکرٹنگ، کارنس اور ٹرِمز کلیکشن تیار کی جا رہی ہے۔ موجودہ پروفائل اقسام، مواد، ابعاد اور فنشز کے لیے زیڈ زی ڈیکور سے رابطہ کریں۔",
    },
    seoTitle: {
      en: "Skirting, Cornices & Architectural Trims | ZZDECOR",
      ur: "اسکرٹنگ، کارنس اور آرکیٹیکچرل ٹرِمز | زیڈ زی ڈیکور",
    },
    seoDescription: {
      en: "Browse verified skirting, cornice, wall-moulding and finishing profiles from ZZDECOR for interior projects in Pakistan.",
      ur: "پاکستان میں اندرونی پراجیکٹس کے لیے زیڈ زی ڈیکور کے تصدیق شدہ اسکرٹنگ، کارنس، وال مولڈنگ اور فنشنگ پروفائلز دیکھیں۔",
    },
    heroLabel: {
      en: "ZZDECOR · Finishing profiles",
      ur: "زیڈ زی ڈیکور · فنشنگ پروفائلز",
    },
    facets: ["material", "colour", "finish", "texture"],
    categoryAliases: [
      "skirting-cornices-trims",
      "skirting-trims",
      "trims",
      "trim",
    ],
    fallback: { productType: "trim" },
  },
];

export function getCategoryBySlug(slug: string): CatalogueCategory | undefined {
  return CATALOGUE_CATEGORIES.find((category) => category.slug === slug);
}

export function categoryPath(locale: Locale, slug: string): string {
  return `/${locale}/collections/${slug}`;
}
