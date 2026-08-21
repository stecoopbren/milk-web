import { MetadataRoute } from "next";

const BASE = "https://www.milk.design";

const caseSlugs = [
  "regenerative-community",
  "casa-siwa",
  "gxm",
  "gxm-building-alignment-before-software",
  "gxm-validate-before-you-build",
  "gxm-design-system-brand-foundations",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/portfolio`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...caseSlugs.map((slug) => ({
      url: `${BASE}/cases/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
