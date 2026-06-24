import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { IndustryData } from '@/data/industries/types';
import WidgetMockup from '@/components/WidgetMockup';

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-text-tertiary">
        <li>
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/industries" className="hover:text-accent transition-colors">
            Industries
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-text-secondary font-medium">{name}</li>
      </ol>
    </nav>
  );
}

export default function IndustryHero({ data }: { data: IndustryData }) {
  const { header } = data;

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-24 md:pb-24">
      <div className="absolute inset-0">
        <Image
          src={`/images/industries/${data.slug}.png`}
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-bg-primary/70" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1180px] pt-4 md:pt-8">
        <Breadcrumb name={data.name} />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="max-w-lg">
            <h1 className="text-[1.85rem] font-bold leading-[1.12] tracking-tight text-text-primary sm:text-[2.35rem]">
              {header.headline}
              {header.accentLine && (
                <span className="text-accent"> {header.accentLine}</span>
              )}
            </h1>

            {header.intro && (
              <p className="mt-4 text-base text-text-secondary sm:text-lg">
                {header.intro}
              </p>
            )}

            <a
              href={header.cta.href}
              className="group mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-primary transition-all duration-250 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-accent-glow"
            >
              {header.cta.text}
              <ArrowRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="hidden lg:block">
            <WidgetMockup />
          </div>
        </div>

        <div className="mt-12 lg:hidden">
          <div className="mx-auto max-w-md">
            <WidgetMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
