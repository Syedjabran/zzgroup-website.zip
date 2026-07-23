'use client';

/* ==========================================================================
   ZZ GROUP — MOTION TEMPLATE
   src/app/(site)/[locale]/template.tsx

   A Next.js template wraps every page inside this route segment
   automatically. No existing file needs editing.

   It renders the page unchanged, and adds:
   1. An inline script that writes .zz-motion-ready onto <html> before the
      page sections are parsed — so nothing flashes visible then hides.
   2. A scroll observer that adds .is-in as elements enter view, staggering
      siblings so each section arrives as one gesture.
   3. Scroll depth tracking for the header hairline.

   Degrades safely: no JS, no IntersectionObserver, or reduced motion all end
   with the page fully visible.

   Note: a template remounts on navigation. That is what re-runs the reveals
   on each page. Client-side state inside the page resets on navigation —
   harmless here, since the catalogue is server-rendered.
   ========================================================================== */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '@/styles/motion.css';

/** Must stay identical to the reveal selector in motion.css. */
const REVEAL_SELECTOR = 'main section > *, [data-reveal]';

const STAGGER_STEP_MS = 80;
const STAGGER_MAX_STEPS = 6;

const OBSERVER_MARGIN = '0px 0px -12% 0px';
const OBSERVER_THRESHOLD = 0.12;

/** If the observer never fires, show anything already on screen. */
const FAILSAFE_MS = 2600;

const BOOT_SCRIPT =
  "document.documentElement.classList.add('zz-motion-ready')";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('zz-motion-ready');

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
    ).filter((el) => !el.closest('[data-no-reveal]'));

    const show = (el: HTMLElement) => el.classList.add('is-in');

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      nodes.forEach(show);
      return;
    }

    // Delay each element by its position among its own siblings, so a section
    // reads as a single gesture rather than unrelated elements popping.
    const seenParents = new Map<Element, number>();
    nodes.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const index = seenParents.get(parent) ?? 0;
      seenParents.set(parent, index + 1);
      const steps = Math.min(index, STAGGER_MAX_STEPS);
      el.style.setProperty('--zz-delay', `${steps * STAGGER_STEP_MS}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: OBSERVER_MARGIN, threshold: OBSERVER_THRESHOLD }
    );

    nodes.forEach((el) => observer.observe(el));

    const failsafe = window.setTimeout(() => {
      nodes.forEach((el) => {
        if (el.classList.contains('is-in')) return;
        if (el.getBoundingClientRect().top < window.innerHeight) show(el);
      });
    }, FAILSAFE_MS);

    // Scroll depth, rAF-throttled so the tablet never drops frames.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        root.dataset.scrolled = String(window.scrollY > 24);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }}
      />
      {children}
    </>
  );
}
