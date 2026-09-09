"use client";
// ===========================================================================
// FILE: src/components/HeroVideo.tsx   (NEW FILE)
//
// Dimmed background video for the hero. Sits behind the hero content and
// never competes with it.
//
// Behaviour
//   · Muted, looping, inline — the only combination browsers will autoplay.
//   · Pauses when scrolled out of view or the tab is hidden, so it does not
//     drain a phone battery while someone reads the rest of the page.
//   · Honours prefers-reduced-motion: holds a still frame instead of playing.
//   · Decorative only — aria-hidden, no audio, no controls, not focusable.
// ===========================================================================

import { useEffect, useRef } from "react";

export default function HeroVideo({
  src = "/hero.mp4",
  poster,
  opacity = 0.3,
}: {
  src?: string;
  poster?: string;
  opacity?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const play = () => {
      if (reduced.matches) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        /* Autoplay refused — the still frame remains, which is fine. */
      });
    };

    play();

    const onVisibility = () => (document.hidden ? video.pause() : play());
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", play);

    // Stop decoding once the hero has scrolled away.
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? play() : video.pause()),
        { threshold: 0.05 },
      );
      observer.observe(video);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", play);
      observer?.disconnect();
    };
  }, []);

  return (
    <div aria-hidden style={wrap}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        tabIndex={-1}
        style={{ ...media, opacity }}
      />
      <div style={scrim} />
    </div>
  );
}

const wrap: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 0,
};

const media: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  filter: "saturate(0.72) contrast(1.08)",
};

/** Keeps the headline legible over any frame of the video. */
const scrim: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  /* Olive architectural wash: the moving material remains visible while the
     image reads as one part of the new split editorial composition. */
  background: [
    "radial-gradient(100% 90% at 80% 10%, rgba(214, 189, 136, 0.12), transparent 58%)",
    "linear-gradient(145deg, rgba(23, 32, 28, 0.46) 0%, rgba(38, 56, 47, 0.32) 58%, rgba(23, 32, 28, 0.58) 100%)",
  ].join(", "),
};
