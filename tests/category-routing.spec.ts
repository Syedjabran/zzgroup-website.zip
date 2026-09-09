import { expect, test, type Page } from "@playwright/test";

test.setTimeout(120_000);

const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);

const categories = [
  { slug: "frame-mouldings", h1: "Frame Mouldings" },
  { slug: "wall-panels", h1: "Wall Panels" },
  { slug: "marble-onyx-panels", h1: "Marble & Onyx Panels" },
  { slug: "wpc-cladding", h1: "WPC Cladding" },
  { slug: "decorative-surfaces", h1: "Decorative Surfaces" },
  {
    slug: "skirting-cornices-trims",
    h1: "Skirting, Cornices & Trims",
  },
] as const;

const requiredPaths = (locale: "en" | "ur") =>
  categories.map(({ slug }) => `/${locale}/collections/${slug}`);

async function canonicalPath(page: Page): Promise<string> {
  const href = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(href, "page must publish a canonical link").toBeTruthy();
  return new URL(href!, baseUrl).pathname;
}

test.describe("homepage category link contract", () => {
  for (const locale of ["en", "ur"] as const) {
    test(`${locale} homepage exposes exactly the six canonical categories`, async ({
      page,
    }) => {
      await page.goto(`${baseUrl}/${locale}`, { waitUntil: "domcontentloaded" });

      const categoryLinks = page.locator(
        `main a[href^="/${locale}/collections/"]`,
      );
      await expect(categoryLinks).toHaveCount(6);

      const hrefs = await categoryLinks.evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute("href")),
      );
      expect(hrefs).toHaveLength(new Set(hrefs).size);
      expect([...hrefs].sort()).toEqual([...requiredPaths(locale)].sort());

      const legacyCategoryLinks = page.locator(
        'main a[href*="/products?"][href*="type="]',
      );
      await expect(legacyCategoryLinks).toHaveCount(0);
    });
  }
});

test.describe("collection route and SEO contract", () => {
  test("English routes have category-specific content and metadata", async ({
    page,
  }) => {
    const titles = new Set<string>();
    const headings = new Set<string>();

    for (const category of categories) {
      const path = `/en/collections/${category.slug}`;
      const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });

      expect(response?.status(), path).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(category.h1);

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title).not.toContain(
        "Collections | Frame Mouldings & Wall Panels Pakistan",
      );
      expect(titles.has(title), `duplicate title: ${title}`).toBe(false);
      titles.add(title);

      const heading = (await page.locator("h1").innerText()).trim();
      expect(headings.has(heading), `duplicate H1: ${heading}`).toBe(false);
      headings.add(heading);

      expect(await canonicalPath(page)).toBe(path);

      const breadcrumb = page.locator(
        'nav[aria-label*="breadcrumb" i], [aria-label*="breadcrumb" i]',
      );
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb).toContainText(category.h1);
    }

    expect(titles.size).toBe(categories.length);
    expect(headings.size).toBe(categories.length);
  });

  for (const locale of ["en", "ur"] as const) {
    test(`${locale} routes are canonical, localized, and paired`, async ({
      page,
    }) => {
      const headings = new Set<string>();

      for (const category of categories) {
        const path = `/${locale}/collections/${category.slug}`;
        const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });

        expect(response?.status(), path).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("html")).toHaveAttribute(
          "dir",
          locale === "ur" ? "rtl" : "ltr",
        );
        await expect(page.locator("h1")).toHaveCount(1);

        const heading = (await page.locator("h1").innerText()).trim();
        expect(heading).toBeTruthy();
        expect(
          headings.has(heading),
          `duplicate ${locale} H1: ${heading}`,
        ).toBe(false);
        headings.add(heading);

        expect(await canonicalPath(page)).toBe(path);

        const enAlternate = page.locator(
          'link[rel="alternate"][hreflang="en"]',
        );
        const urAlternate = page.locator(
          'link[rel="alternate"][hreflang="ur"]',
        );
        await expect(enAlternate).toHaveCount(1);
        await expect(urAlternate).toHaveCount(1);
        expect(
          new URL((await enAlternate.getAttribute("href"))!, baseUrl).pathname,
        ).toBe(`/en/collections/${category.slug}`);
        expect(
          new URL((await urAlternate.getAttribute("href"))!, baseUrl).pathname,
        ).toBe(`/ur/collections/${category.slug}`);
      }
    });
  }

  test("invalid and unpublished collection slugs return a real 404", async ({
    request,
  }) => {
    for (const locale of ["en", "ur"]) {
      const response = await request.get(
        `${baseUrl}/${locale}/collections/not-a-real-category`,
        { maxRedirects: 0 },
      );
      expect(response.status()).toBe(404);
    }
  });
});

test.describe("structured data contract", () => {
  test("every English collection includes matching BreadcrumbList JSON-LD", async ({
    page,
  }) => {
    for (const category of categories) {
      const path = `/en/collections/${category.slug}`;
      await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });

      const scripts = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      const objects = scripts.flatMap((source) => {
        try {
          const value = JSON.parse(source);
          return Array.isArray(value) ? value : [value];
        } catch {
          return [];
        }
      });
      const breadcrumb = objects.find(
        (value) => value?.["@type"] === "BreadcrumbList",
      );

      expect(breadcrumb, `${path} BreadcrumbList`).toBeTruthy();
      expect(breadcrumb.itemListElement).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item: expect.stringContaining(path),
          }),
        ]),
      );
    }
  });
});
