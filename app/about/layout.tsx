import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Milk is a strategic design studio led by Steven Cooper. We work at the intersection of strategy, product, and brand to help ambitious companies find clarity before they build.",
  alternates: { canonical: "https://www.milk.design/about" },
  openGraph: {
    type: "website",
    url: "https://www.milk.design/about",
    title: "About — Milk Design Studio",
    description: "Milk is a strategic design studio led by Steven Cooper. We work at the intersection of strategy, product, and brand to help ambitious companies find clarity before they build.",
    images: [{ url: "https://www.milk.design/og-image.png", width: 1200, height: 630, alt: "Milk Design Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Milk Design Studio",
    description: "Milk is a strategic design studio led by Steven Cooper. We work at the intersection of strategy, product, and brand to help ambitious companies find clarity before they build.",
    images: ["https://www.milk.design/og-image.png"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
