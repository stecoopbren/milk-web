import { getCaseBySlug, getAllCases } from '@/app/lib/cases';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import CaseTemplate from '@/app/components/CaseTemplate';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseData = getCaseBySlug(slug);
  if (!caseData) notFound();

  return (
    <main className="relative">
      <div className="relative z-10">
        <Nav />
        <CaseTemplate caseData={caseData} />
        <Footer />
      </div>
    </main>
  );
}
