import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LEGAL } from '@/lib/legal/config';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  /** Short lede shown above the table of contents. */
  intro: ReactNode;
  sections: LegalSection[];
}

export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-6 bg-bg-primary">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">
            {title}
          </h1>
          <p className="text-sm text-text-tertiary mb-8">
            Effective date: {LEGAL.effectiveDate}
            <span className="mx-2" aria-hidden="true">·</span>
            Last updated: {LEGAL.lastUpdated}
          </p>

          <div className="space-y-4 text-text-secondary leading-relaxed mb-10">
            {intro}
          </div>

          <nav
            aria-label="Table of contents"
            className="legal-toc bg-bg-secondary border border-border-default rounded-xl p-6 mb-12"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary mb-4">
              Contents
            </h2>
            <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2 list-decimal list-inside text-sm marker:text-text-tertiary">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-prose">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.body}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
