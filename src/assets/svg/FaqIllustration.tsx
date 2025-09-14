// src/assets/svg/FaqIllustration.tsx
import * as React from "react";

/**
 * Decorative FAQ illustration with theme-aware colors.
 * Uses CSS variables so it adapts to light/dark automatically.
 */
export default function FaqIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 560 420"
      role="img"
      aria-label="سوالات متداول"
      {...props}
    >
      <defs>
        <linearGradient id="faq-grad-1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
          <stop offset="100%" style={{ stopColor: "var(--secondary)" }} />
        </linearGradient>
        <linearGradient id="faq-grad-2" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--accent-foreground)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
        <filter id="faq-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* Soft blob background */}
      <path
        d="M110,220c0,-90 70,-150 170,-150c120,0 170,60 170,140c0,100 -90,130 -170,130c-100,0 -170,-40 -170,-120z"
        fill="url(#faq-grad-2)"
        opacity="0.10"
      />
      <ellipse cx="160" cy="330" rx="70" ry="12" fill="var(--border)" opacity="0.35" filter="url(#faq-blur)" />
      <ellipse cx="270" cy="360" rx="110" ry="14" fill="var(--border)" opacity="0.25" filter="url(#faq-blur)" />

      {/* Big question mark */}
      <g transform="translate(210 80)">
        <path
          d="M60,160 L60,140 C60,115 120,110 120,70 C120,45 100,30 75,30 C45,30 25,45 15,70 L-10,60 C5,25 40,5 75,5 C115,5 150,30 150,70 C150,120 90,125 90,140 L90,160 Z"
          fill="url(#faq-grad-1)"
        />
        <circle cx="75" cy="185" r="12" fill="url(#faq-grad-1)" />
      </g>

      {/* Medium question mark */}
      <g transform="translate(110 140) scale(0.7)">
        <path
          d="M60,160 L60,140 C60,115 120,110 120,70 C120,45 100,30 75,30 C45,30 25,45 15,70 L-10,60 C5,25 40,5 75,5 C115,5 150,30 150,70 C150,120 90,125 90,140 L90,160 Z"
          fill="url(#faq-grad-1)"
          opacity="0.85"
        />
        <circle cx="75" cy="185" r="12" fill="url(#faq-grad-1)" opacity="0.85" />
      </g>

      {/* Small question mark */}
      <g transform="translate(70 200) scale(0.5)">
        <path
          d="M60,160 L60,140 C60,115 120,110 120,70 C120,45 100,30 75,30 C45,30 25,45 15,70 L-10,60 C5,25 40,5 75,5 C115,5 150,30 150,70 C150,120 90,125 90,140 L90,160 Z"
          fill="url(#faq-grad-1)"
          opacity="0.75"
        />
        <circle cx="75" cy="185" r="12" fill="url(#faq-grad-1)" opacity="0.75" />
      </g>
    </svg>
  );
}
