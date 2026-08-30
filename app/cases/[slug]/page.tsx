import { getCaseBySlug, getAllCases } from '@/app/lib/cases';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import CaseTemplate from '@/app/components/CaseTemplate';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseData = getCaseBySlug(slug);
  if (!caseData) return {};

  const title = `${caseData.title.replace(/\n/g, " ")} — ${caseData.client}`;
  const description = caseData.subtitle;
  const url = `https://www.milk.design/cases/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [
        {
          url: caseData.heroImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [caseData.heroImage],
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseData = getCaseBySlug(slug);
  if (!caseData) notFound();

  const title = `${caseData.title.replace(/\n/g, " ")} — ${caseData.client}`;
  const url = `https://www.milk.design/cases/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: caseData.subtitle,
    url,
    image: caseData.heroImage,
    creator: {
      "@type": "Organization",
      name: "Milk Design Studio",
      url: "https://www.milk.design",
    },
    keywords: caseData.tags.join(", "),
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative z-10">
        <Nav />
        <CaseTemplate caseData={caseData} />
        <Footer />
      </div>
    </main>
  );
}
