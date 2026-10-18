import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Steven Cooper",
  description:
    "Steven Cooper works at the intersection of strategy, product, and brand. Helping ambitious founders and operators find clarity before they commit to a direction.",
  alternates: { canonical: "https://www.milk.design/about" },
  openGraph: {
    type: "website",
    url: "https://www.milk.design/about",
    title: "About Steven Cooper — Milk Design Studio",
    description:
      "Steven Cooper works at the intersection of strategy, product, and brand. Helping ambitious founders and operators find clarity before they commit to a direction.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Milk Design Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Steven Cooper — Milk Design Studio",
    description:
      "Steven Cooper works at the intersection of strategy, product, and brand. Helping ambitious founders and operators find clarity before they commit to a direction.",
    images: ["/opengraph-image"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
